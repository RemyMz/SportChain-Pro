// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";

/**
 * @title PerformanceAttestation
 * @author [Ton Nom/Organisation]
 * @notice Ce contrat permet la certification de performances sportives via des NFTs Soulbound (SBT).
 * @dev Les jetons sont non-transférables. Seuls l'admin et les coachs accrédités peuvent interagir 
 * avec les fonctions de création et d'enregistrement.
 */
contract PerformanceAttestation is ERC721 {
    
    /// @notice Adresse du gestionnaire principal du contrat (déployeur)
    address public admin;

    /// @dev Compteur interne pour l'ID unique de chaque attestation
    uint256 private _nextTokenId = 1;

    /**
     * @dev Structure représentant les détails d'une performance sportive.
     */
    struct Attestation {
        uint256 tokenId;        // ID unique du NFT
        address athlete;        // Adresse du bénéficiaire
        string sport;           // Discipline sportive
        string performanceType; // Type d'effort (ex: "100m", "Développé couché")
        uint256 score;          // Valeur numérique de la performance
        string unit;            // Unité de mesure (ex: "secondes", "kg")
        uint256 timestamp;      // Date d'enregistrement (block.timestamp)
        address coach;          // Coach ayant certifié la performance
    }

    /// @notice Mapping associant un athlète à la liste de ses attestations
    mapping(address => Attestation[]) private athleteAttestations;

    /// @notice Mapping pour vérifier si une adresse possède les droits de "Coach"
    mapping(address => bool) public isCoach;

    /// @notice Mapping associant une adresse d'athlète à son nom/pseudo
    mapping(address => string) public athleteNames;

    // --- Événements ---

    event AttestationCreated(uint256 indexed tokenId, address indexed athlete, string athleteName, address indexed coach, string sport, string performanceType, uint256 score, string unit);
    event CoachAdded(address indexed coach);
    event CoachRemoved(address indexed coach);
    event AthleteRegistered(address indexed athlete, string name);
    event AttestationRevoked(uint256 indexed tokenId, address indexed athlete);

    /**
     * @dev Restreint l'accès aux fonctions au seul administrateur.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Auth: Non autorise (Admin requis)");
        _;
    }

    /**
     * @dev Restreint l'accès aux fonctions aux coachs enregistrés.
     */
    modifier onlyCoach() {
        require(isCoach[msg.sender], "Auth: Non autorise (Coach requis)");
        _;
    }

    /**
     * @dev Initialise le contrat avec un nom et un symbole pour le jeton ERC721.
     */
    constructor() ERC721("SportChain Certificate", "SPORT") {
        admin = msg.sender;
    }

    // --- Fonctions d'Administration ---

    /**
     * @notice Accrédite un nouveau coach pour valider des performances.
     * @dev Seul l'admin peut appeler cette fonction.
     * @param _coach L'adresse Ethereum du futur coach.
     */
    function addCoach(address _coach) external onlyAdmin {
        require(_coach != address(0), "Erreur: Adresse invalide");
        require(!isCoach[_coach], "Erreur: Coach deja existant");
        isCoach[_coach] = true;
        emit CoachAdded(_coach);
    }

    /**
     * @notice Révoque les droits d'un coach.
     * @dev Seul l'admin peut appeler cette fonction.
     * @param _coach L'adresse du coach à supprimer.
     */
    function removeCoach(address _coach) external onlyAdmin {
        require(isCoach[_coach], "Erreur: Coach non trouve");
        isCoach[_coach] = false;
        emit CoachRemoved(_coach);
    }

    // --- Fonctions Coach ---

    /**
     * @notice Enregistre ou met à jour l'identité d'un athlète dans le système.
     * @dev Nécessaire avant de pouvoir créer une attestation pour cet athlète.
     * @param _athlete Adresse du portefeuille de l'athlète.
     * @param _name Nom ou pseudonyme à afficher sur l'attestation.
     */
    function registerAthlete(address _athlete, string calldata _name) external onlyCoach {
        require(_athlete != address(0), "Erreur: Adresse invalide");
        athleteNames[_athlete] = _name;
        emit AthleteRegistered(_athlete, _name);
    }

    /**
     * @notice Génère un certificat (NFT) de performance pour un athlète.
     * @dev Le NFT est envoyé directement à l'athlète. Il est "Soulbound".
     * @param _athlete Adresse du destinataire.
     * @param _sport Nom du sport concerné.
     * @param _performanceType Nature de la performance.
     * @param _score Résultat chiffré.
     * @param _unit Unité du score.
     */
    function createAttestation(
        address _athlete,
        string calldata _sport,
        string calldata _performanceType,
        uint256 _score,
        string calldata _unit 
    ) external onlyCoach {
        require(bytes(athleteNames[_athlete]).length > 0, "Erreur: Athlete non enregistre");

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

    // --- Révocation ---

    /**
     * @notice Supprime définitivement une attestation erronée ou frauduleuse.
     * @dev Brûle le NFT et retire l'entrée dans l'historique de l'athlète.
     * Seul l'admin ou le coach ayant créé l'attestation peut la révoquer.
     * @param _athlete Adresse du détenteur du certificat.
     * @param _tokenId ID du NFT à révoquer.
     */
    function revokeAttestation(address _athlete, uint256 _tokenId) external {
        require(ownerOf(_tokenId) == _athlete, "Erreur: L'athlete ne possede pas ce token");
        
        bool found = false;
        uint256 indexToRemove;
        Attestation[] storage attestations = athleteAttestations[_athlete];
        
        uint256 length = attestations.length;
        for (uint256 i = 0; i < length; i++) {
            if (attestations[i].tokenId == _tokenId) {
                // Vérification de sécurité : admin ou coach originel uniquement
                require(msg.sender == admin || msg.sender == attestations[i].coach, "Auth: Non autorise a revoquer");
                found = true;
                indexToRemove = i;
                break;
            }
        }
        
        require(found, "Erreur: Attestation non trouvee");

        _burn(_tokenId);

        // Nettoyage du tableau (Echange avec le dernier élément puis pop pour économiser du gaz)
        attestations[indexToRemove] = attestations[length - 1];
        attestations.pop();

        emit AttestationRevoked(_tokenId, _athlete);
    }

    // --- Override pour Soulbound (SBT) ---

    /**
     * @dev Bloque tous les transferts de jetons entre utilisateurs.
     * Autorise uniquement l'émission (from == 0) et la destruction (to == 0).
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        require(from == address(0) || to == address(0), "Ce NFT est Soulbound : transfert interdit");
    }

    // --- Fonctions de Lecture (Vues) ---

    /**
     * @notice Récupère la liste complète des performances d'un athlète.
     * @param _athlete Adresse du profil à consulter.
     * @return Un tableau de structures Attestation.
     */
    function getAthleteAttestations(address _athlete) external view returns (Attestation[] memory) {
        return athleteAttestations[_athlete];
    }

    /**
     * @notice Récupère le nom enregistré pour une adresse donnée.
     * @param _athlete Adresse de l'athlète.
     * @return Le nom sous forme de chaîne de caractères.
     */
    function getAthleteName(address _athlete) external view returns (string memory) {
        return athleteNames[_athlete];
    }
}