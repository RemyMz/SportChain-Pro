// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";

/**
 * @title PerformanceAttestation
 * @author Rémy MAZINGUE / IMT NORD EUROPE
 * @notice Gère la certification de performances sportives via des Soulbound Tokens (SBT).
 * @dev Les jetons sont non-transférables (Soulbound). Seuls l'admin et les coachs peuvent agir.
 * Le contrat hérite d'ERC721 mais surcharge les transferts pour les bloquer[cite: 2, 3, 39].
 */
contract PerformanceAttestation is ERC721 {
    
    /** * @notice Adresse du super-utilisateur ayant les droits de gestion des coachs et retrait de fonds[cite: 13, 16].
     */
    address public admin;

    /** * @dev Compteur interne pour l'ID du prochain jeton à forger[cite: 3].
     */
    uint256 private _nextTokenId = 1;

    /** * @notice Prix fixe (0.01 ETH) pour l'achat d'un thème cosmétique par un athlète[cite: 4].
     */
    uint256 public constant THEME_PREMIUM_PRICE = 0.01 ether;

    /** * @notice Structure représentant une performance certifiée sur la blockchain.
     * @param tokenId Identifiant unique du NFT.
     * @param athlete Adresse du sportif détenteur du record.
     * @param sport Discipline sportive (ex: Natation).
     * @param performanceType Type d'exercice (ex: 50m Nage Libre).
     * @param score Valeur numérique de la performance.
     * @param unit Unité de mesure associée (s, kg, m, h, etc.).
     * @param timestamp Date de certification (temps UNIX).
     * @param coach Adresse du professionnel ayant validé la performance.
     */
    struct Attestation {
        uint256 tokenId;
        address athlete;
        string sport;
        string performanceType;
        uint256 score;
        string unit;
        uint256 timestamp;
        address coach;
    }

    /** @dev Mapping associant un athlète à son historique complet d'attestations[cite: 6]. */
    mapping(address => Attestation[]) private athleteAttestations;

    /** @dev Mapping indiquant si une adresse possède les droits de Coach[cite: 7]. */
    mapping(address => bool) public isCoach;

    /** @dev Mapping stockant le nom public lié à une adresse d'athlète[cite: 8]. */
    mapping(address => string) public athleteNames;

    /** @dev Double mapping pour vérifier si un utilisateur possède un thème spécifique[cite: 9]. */
    mapping(address => mapping(uint256 => bool)) public hasTheme;

    // --- ÉVÉNEMENTS ---

    /** @notice Émis lors de la création d'un nouveau certificat de performance[cite: 10]. */
    event AttestationCreated(uint256 indexed tokenId, address indexed athlete, string athleteName, address indexed coach, string sport, string performanceType, uint256 score, string unit);
    
    /** @notice Émis lorsqu'un nouveau coach est accrédité[cite: 11]. */
    event CoachAdded(address indexed coach);
    
    /** @notice Émis lorsqu'un coach perd ses droits d'accès[cite: 11]. */
    event CoachRemoved(address indexed coach);
    
    /** @notice Émis lorsqu'un athlète est lié à un nom pour la première fois[cite: 11]. */
    event AthleteRegistered(address indexed athlete, string name);
    
    /** @notice Émis lors de la suppression (burn) d'une attestation[cite: 12]. */
    event AttestationRevoked(uint256 indexed tokenId, address indexed athlete);
    
    /** @notice Émis lors de l'achat réussi d'un thème premium[cite: 12]. */
    event ThemePurchased(address indexed athlete, uint256 themeId);

    // --- MODIFICATEURS ---

    /** @dev Restreint l'accès aux fonctions à l'adresse admin uniquement[cite: 13]. */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Acces refuse : Admin requis");
        _;
    }

    /** @dev Restreint l'accès aux coachs accrédités ou à l'admin[cite: 14]. */
    modifier onlyCoach() {
        require(isCoach[msg.sender] || msg.sender == admin, "Acces refuse : Coach requis");
        _;
    }

    /**
     * @dev Constructeur initialisant le nom et le symbole du jeton, et définit l'admin[cite: 16].
     */
    constructor() ERC721("SportChain Certificate", "SPORT") {
        admin = msg.sender;
    }

    // --- FONCTIONS ADMINISTRATIVES ---

    /**
     * @notice Accrédite un nouveau coach.
     * @param _coach L'adresse du futur coach.
     * @dev Seul l'admin peut appeler cette fonction[cite: 18, 19].
     */
    function addCoach(address _coach) external onlyAdmin {
        require(_coach != address(0), "Adresse invalide");
        require(!isCoach[_coach], "Deja coach");
        isCoach[_coach] = true;
        emit CoachAdded(_coach);
    }

    /**
     * @notice Retire les droits d'écriture à un coach.
     * @param _coach L'adresse du coach à révoquer.
     * @dev Seul l'admin peut appeler cette fonction[cite: 20, 21].
     */
    function removeCoach(address _coach) external onlyAdmin {
        require(isCoach[_coach], "Coach non repertorie");
        isCoach[_coach] = false;
        emit CoachRemoved(_coach);
    }

    /**
     * @notice Retire les fonds (ETH) accumulés par les ventes de thèmes.
     * @dev Transfère la totalité de la balance du contrat à l'admin[cite: 22, 23].
     */
    function withdraw() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "Aucun fonds a retirer");
        payable(admin).transfer(balance);
    }

    // --- FONCTIONS COACH ---

    /**
     * @notice Enregistre l'identité d'un athlète dans le système.
     * @param _athlete Adresse publique de l'athlète.
     * @param _name Nom ou pseudonyme de l'athlète.
     * @dev Pré-requis nécessaire avant toute création d'attestation[cite: 24, 25, 26].
     */
    function registerAthlete(address _athlete, string calldata _name) external onlyCoach {
        require(_athlete != address(0), "Adresse invalide");
        athleteNames[_athlete] = _name;
        emit AthleteRegistered(_athlete, _name);
    }

    /**
     * @notice Génère et attribue un certificat de performance (SBT).
     * @param _athlete Adresse du destinataire.
     * @param _sport Nom de la discipline.
     * @param _performanceType Détail de l'exercice.
     * @param _score Valeur de la performance.
     * @param _unit Unité associée.
     * @dev Incrémente l'ID du jeton et émet un événement complet pour le front-end[cite: 26, 27, 29].
     */
    function createAttestation(
        address _athlete,
        string calldata _sport,
        string calldata _performanceType,
        uint256 _score,
        string calldata _unit 
    ) external onlyCoach {
        require(bytes(athleteNames[_athlete]).length > 0, "Athlete non enregistre");
        uint256 tokenId = _nextTokenId++;
        _mint(_athlete, tokenId);

        Attestation memory newAttestation = Attestation({
            tokenId: tokenId,
            athlete: _athlete,
            sport: _sport,
            performanceType: _performanceType,
            score: _score,
            unit: _unit,
            timestamp: block.timestamp,
            coach: msg.sender
        });
        athleteAttestations[_athlete].push(newAttestation);
        emit AttestationCreated(tokenId, _athlete, athleteNames[_athlete], msg.sender, _sport, _performanceType, _score, _unit);
    }

    // --- BOUTIQUE ---

    /**
     * @notice Permet à un athlète d'acheter un thème visuel premium.
     * @param _themeId Identifiant du thème souhaité.
     * @dev Requiert l'envoi exact ou supérieur de THEME_PREMIUM_PRICE en ETH[cite: 31, 32].
     */
    function buyTheme(uint256 _themeId) external payable {
        require(msg.value >= THEME_PREMIUM_PRICE, "Prix incorrect");
        require(!hasTheme[msg.sender][_themeId], "Deja possede");
        
        hasTheme[msg.sender][_themeId] = true;
        emit ThemePurchased(msg.sender, _themeId);
    }

    // --- RÉVOCATION ---

    /**
     * @notice Détruit une attestation existante en cas d'erreur ou fraude.
     * @param _athlete Adresse du propriétaire du jeton.
     * @param _tokenId ID du jeton à supprimer.
     * @dev Seul l'admin ou le coach émetteur peut révoquer. Utilise l'échange d'index pour optimiser le gaz[cite: 33, 34, 35, 37].
     */
    function revokeAttestation(address _athlete, uint256 _tokenId) external {
        require(ownerOf(_tokenId) == _athlete, "Proprietaire incorrect");
        Attestation[] storage attestations = athleteAttestations[_athlete];
        bool found = false;

        for (uint256 i = 0; i < attestations.length; i++) {
            if (attestations[i].tokenId == _tokenId) {
                require(msg.sender == admin || msg.sender == attestations[i].coach, "Non autorise");
                // Remplacement par le dernier élément pour pop() efficace [cite: 35]
                attestations[i] = attestations[attestations.length - 1];
                attestations.pop();
                found = true;
                break;
            }
        }
        
        require(found, "Attestation introuvable");
        _burn(_tokenId);
        emit AttestationRevoked(_tokenId, _athlete);
    }

    // --- SOULBOUND LOGIC ---

    /**
     * @dev Surcharge interne bloquant tout transfert du jeton après émission.
     * @notice Empêche l'échange des certificats entre utilisateurs (Soulbound)[cite: 38, 39].
     */
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        // Seuls le Mint (from == 0) et le Burn (to == 0) sont autorisés [cite: 39]
        require(from == address(0) || to == address(0), "SBT : Transfert interdit");
    }

    // --- VUES ---

    /** @notice Retourne la liste complète des attestations pour une adresse donnée[cite: 40]. */
    function getAthleteAttestations(address _athlete) external view returns (Attestation[] memory) {
        return athleteAttestations[_athlete];
    }

    /** @notice Retourne le nom enregistré pour une adresse donnée[cite: 41]. */
    function getAthleteName(address _athlete) external view returns (string memory) {
        return athleteNames[_athlete];
    }
}