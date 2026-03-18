// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";

/**
 * @title PerformanceAttestation
 * @notice Gère la certification de performances sportives via des Soulbound Tokens (SBT).
 * @dev Les jetons sont non-transférables. Seuls l'admin et les coachs peuvent agir.
 */
contract PerformanceAttestation is ERC721 {
    
    address public admin;
    uint256 private _nextTokenId = 1;
    
    /// @notice Prix pour l'achat d'un thème visuel (Skin NFT)
    uint256 public constant THEME_PREMIUM_PRICE = 0.01 ether;

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

    /// @dev Stockage des attestations par adresse d'athlète
    mapping(address => Attestation[]) private athleteAttestations;
    /// @dev Registre des coachs autorisés
    mapping(address => bool) public isCoach;
    /// @dev Registre des noms d'athlètes
    mapping(address => string) public athleteNames;
    /// @dev Suivi des thèmes cosmétiques achetés
    mapping(address => mapping(uint256 => bool)) public hasTheme;

    // --- ÉVÉNEMENTS ---
    event AttestationCreated(uint256 indexed tokenId, address indexed athlete, string athleteName, address indexed coach, string sport, string performanceType, uint256 score, string unit);
    event CoachAdded(address indexed coach);
    event CoachRemoved(address indexed coach);
    event AthleteRegistered(address indexed athlete, string name);
    event AttestationRevoked(uint256 indexed tokenId, address indexed athlete);
    event ThemePurchased(address indexed athlete, uint256 themeId);

    // --- MODIFICATEURS ---
    modifier onlyAdmin() {
        require(msg.sender == admin, "Acces refuse : Admin requis");
        _;
    }

    modifier onlyCoach() {
        require(isCoach[msg.sender] || msg.sender == admin, "Acces refuse : Coach requis");
        _;
    }

    /**
     * @dev Initialise le contrat et définit l'admin.
     */
    constructor() ERC721("SportChain Certificate", "SPORT") {
        admin = msg.sender;
    }

    // --- FONCTIONS ADMINISTRATIVES ---

    /**
     * @notice Ajoute un coach au système.
     */
    function addCoach(address _coach) external onlyAdmin {
        require(_coach != address(0), "Adresse invalide");
        require(!isCoach[_coach], "Deja coach");
        isCoach[_coach] = true;
        emit CoachAdded(_coach);
    }

    /**
     * @notice Supprime les droits d'un coach.
     */
    function removeCoach(address _coach) external onlyAdmin {
        require(isCoach[_coach], "Coach non repertorie");
        isCoach[_coach] = false;
        emit CoachRemoved(_coach);
    }

    /**
     * @notice Récupère les fonds (ETH) collectés par la vente de thèmes.
     */
    function withdraw() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "Aucun fonds a retirer");
        payable(admin).transfer(balance);
    }

    // --- FONCTIONS COACH ---

    /**
     * @notice Enregistre l'identité d'un athlète avant certification.
     */
    function registerAthlete(address _athlete, string calldata _name) external onlyCoach {
        require(_athlete != address(0), "Adresse invalide");
        athleteNames[_athlete] = _name;
        emit AthleteRegistered(_athlete, _name);
    }

    /**
     * @notice Crée une attestation de performance (Mint du SBT).
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
     * @notice Permet à un utilisateur d'acheter un thème visuel.
     */
    function buyTheme(uint256 _themeId) external payable {
        require(msg.value >= THEME_PREMIUM_PRICE, "Prix incorrect");
        require(!hasTheme[msg.sender][_themeId], "Deja possede");
        
        hasTheme[msg.sender][_themeId] = true;
        emit ThemePurchased(msg.sender, _themeId);
    }

    // --- RÉVOCATION ---

    /**
     * @notice Supprime une attestation de la blockchain.
     */
    function revokeAttestation(address _athlete, uint256 _tokenId) external {
        require(ownerOf(_tokenId) == _athlete, "Proprietaire incorrect");
        
        Attestation[] storage attestations = athleteAttestations[_athlete];
        bool found = false;

        for (uint256 i = 0; i < attestations.length; i++) {
            if (attestations[i].tokenId == _tokenId) {
                require(msg.sender == admin || msg.sender == attestations[i].coach, "Non autorise");
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
     * @dev Bloque les transferts entre utilisateurs pour garantir le statut "Soulbound".
     */
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        require(from == address(0) || to == address(0), "SBT : Transfert interdit");
    }

    // --- VUES ---

    function getAthleteAttestations(address _athlete) external view returns (Attestation[] memory) {
        return athleteAttestations[_athlete];
    }

    function getAthleteName(address _athlete) external view returns (string memory) {
        return athleteNames[_athlete];
    }
}