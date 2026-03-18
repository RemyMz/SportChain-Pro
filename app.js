/**
 * @file app.js
 * @description Logique Front-end pour la plateforme de certification sportive SportChain.
 * Gère l'interaction avec le smart contract, la gestion des rôles (Admin, Coach, Athlète)
 * et la génération de certificats dynamiques.
 */

// --- CONFIGURATION DU SMART CONTRACT ---
/** @constant {string} Adresse du contrat déployé sur le réseau */
const contractAddress = "0xcCab62819CBf29BaefF5FC8C3F4B72Fe9d247fCB";

/** @constant {Array} ABI (Application Binary Interface) du contrat */
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "athlete",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "AthleteRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "athlete",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "athleteName",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "coach",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sport",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "performanceType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "unit",
        type: "string",
      },
    ],
    name: "AttestationCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "athlete",
        type: "address",
      },
    ],
    name: "AttestationRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "coach",
        type: "address",
      },
    ],
    name: "CoachAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "coach",
        type: "address",
      },
    ],
    name: "CoachRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_coach",
        type: "address",
      },
    ],
    name: "addCoach",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "athleteNames",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_athlete",
        type: "address",
      },
      {
        internalType: "string",
        name: "_sport",
        type: "string",
      },
      {
        internalType: "string",
        name: "_performanceType",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_score",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_unit",
        type: "string",
      },
    ],
    name: "createAttestation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_athlete",
        type: "address",
      },
    ],
    name: "getAthleteAttestations",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "athlete",
            type: "address",
          },
          {
            internalType: "string",
            name: "sport",
            type: "string",
          },
          {
            internalType: "string",
            name: "performanceType",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "unit",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "coach",
            type: "address",
          },
        ],
        internalType: "struct PerformanceAttestation.Attestation[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_athlete",
        type: "address",
      },
    ],
    name: "getAthleteName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isCoach",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_athlete",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "registerAthlete",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_coach",
        type: "address",
      },
    ],
    name: "removeCoach",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_athlete",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "revokeAttestation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/** @constant {Object} Structure de données pour les catégories de sport et unités */
const sportsData = {
  Athlétisme: {
    "100m Sprint": "s",
    "Saut en longueur": "m",
    "Lancer de poids": "m",
  },
  "Course à pied": { "10 km Route": "min", Marathon: "h" },
  Haltérophilie: { Squat: "kg", "Soulevé de terre": "kg" },
  Natation: { "50m Nage Libre": "s", "200m Papillon": "min" },
  CrossFit: { Murph: "min", Fran: "min", "Max Pull-ups": "pts" },
};

/** @global Variables Web3 */
let web3, contract, currentAccount;

// --- INITIALISATION ET ÉCOUTEURS ---

/**
 * Initialisation au chargement de la page.
 * Vérifie la présence de MetaMask et initialise Web3/Contract.
 */
window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
    initSportSelects();

    // Écoute les changements de compte directement depuis MetaMask
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        updateAccountUI();
        resetUI();
        checkPermissions();
      } else {
        window.location.reload(); // Déconnexion
      }
    });

    // Écoute les changements de réseau (ex: passage de Sepolia à Mainnet)
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  } else {
    alert("Veuillez installer MetaMask pour utiliser cette application.");
  }
});

// --- UTILITAIRES UX ---

/**
 * Met à jour l'affichage de l'adresse du compte connecté
 */
function updateAccountUI() {
  document.getElementById("accountArea").innerText =
    currentAccount.substring(0, 15) + "...";
}

/**
 * Cache tous les blocs de rôles (Admin, Coach, Athlète) pour réinitialiser la vue
 */
function resetUI() {
  document.getElementById("block-admin").classList.add("hidden");
  document.getElementById("block-coach").classList.add("hidden");
  document.getElementById("block-athlete").classList.add("hidden");
}

/**
 * Gère l'état visuel d'un bouton pendant un appel blockchain (chargement)
 * @param {string} buttonId - ID du bouton HTML
 * @param {boolean} isLoading - État de chargement
 * @param {string} originalText - Texte à restaurer après le chargement
 */
function setLoadingState(buttonId, isLoading, originalText) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  if (isLoading) {
    btn.disabled = true;
    btn.innerText = "⏳ Traitement...";
    btn.style.opacity = "0.7";
  } else {
    btn.disabled = false;
    btn.innerText = originalText;
    btn.style.opacity = "1";
  }
}

/**
 * Centralisation de la gestion des erreurs Web3
 * @param {Error} error - L'objet erreur capturé
 * @param {string} customMessage - Message contextuel pour l'utilisateur
 */
function handleError(error, customMessage) {
  console.error(error);
  if (error.code === 4001) {
    alert("Transaction annulée par l'utilisateur.");
  } else {
    alert(`${customMessage} : Vérifiez la console pour plus de détails.`);
  }
}

// --- CONNEXION ---

/**
 * Procédure de connexion via MetaMask
 */
document.getElementById("connectButton").addEventListener("click", async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("appArea").classList.remove("hidden");

    updateAccountUI();
    await checkPermissions();
  } catch (error) {
    handleError(error, "Erreur lors de la connexion à MetaMask");
  }
});

// --- PERMISSIONS ---

/**
 * Vérifie le rôle de l'utilisateur connecté sur la blockchain
 * Affiche les sections correspondantes (Admin, Coach, Athlète)
 */
async function checkPermissions() {
  try {
    // Exécution des requêtes en parallèle pour optimiser les performances
    const [adminAddr, isCoach, athleteName] = await Promise.all([
      contract.methods.admin().call(),
      contract.methods.isCoach(currentAccount).call(),
      contract.methods.getAthleteName(currentAccount).call(),
    ]);

    const isAdmin = currentAccount.toLowerCase() === adminAddr.toLowerCase();

    if (isAdmin) {
      document.getElementById("block-admin").classList.remove("hidden");
      refreshCoachList();
    }

    if (isCoach) {
      document.getElementById("block-coach").classList.remove("hidden");
      refreshAthleteList();
    }

    if (athleteName && athleteName !== "") {
      document.getElementById("block-athlete").classList.remove("hidden");
      document.getElementById("athleteWelcome").innerText =
        `Bonjour, ${athleteName}`;
      loadAthleteDashboard(athleteName);
    }
  } catch (e) {
    console.error("Erreur lors de la vérification des permissions", e);
  }
}

// --- LOGIQUE ADMIN ---

/**
 * Récupère et affiche la liste des coachs actifs à partir des événements "CoachAdded"
 */
async function refreshCoachList() {
  const tbody = document.getElementById("coachTableBody");
  try {
    const events = await contract.getPastEvents("CoachAdded", {
      fromBlock: 0,
      toBlock: "latest",
    });

    // Parallélisation des vérifications de statut des coachs
    const coachesData = await Promise.all(
      events.map(async (e) => {
        const addr = e.returnValues.coach;
        const active = await contract.methods.isCoach(addr).call();
        const block = await web3.eth.getBlock(e.blockNumber);
        return { addr, active, timestamp: block.timestamp };
      }),
    );

    tbody.innerHTML = coachesData
      .filter((c) => c.active)
      .map(
        (c) => `
        <tr>
          <td style="font-family:monospace">${c.addr.substring(0, 20)}...</td>
          <td>${new Date(c.timestamp * 1000).toLocaleDateString()}</td>
          <td><button class="btn-small btn-danger" onclick="revokeCoach('${c.addr}')">Révoquer</button></td>
        </tr>
      `,
      )
      .join("");
  } catch (err) {
    console.error("Erreur refreshCoachList:", err);
  }
}

/**
 * Révoque les droits d'un coach (Admin uniquement)
 * @param {string} addr - Adresse du coach à révoquer
 */
window.revokeCoach = async function (addr) {
  if (!confirm("Révoquer définitivement ce coach ?")) return;
  try {
    await contract.methods.removeCoach(addr).send({ from: currentAccount });
    refreshCoachList();
  } catch (error) {
    handleError(error, "Erreur lors de la révocation du coach");
  }
};

/**
 * Ajoute un nouveau coach (Admin uniquement)
 */
document
  .getElementById("addCoachButton")
  ?.addEventListener("click", async () => {
    const addr = document.getElementById("coachAddress").value;
    if (!web3.utils.isAddress(addr)) return alert("Adresse Ethereum invalide.");

    setLoadingState("addCoachButton", true, "Promouvoir Coach");
    try {
      await contract.methods.addCoach(addr).send({ from: currentAccount });
      alert("Coach ajouté avec succès !");
      document.getElementById("coachAddress").value = "";
      refreshCoachList();
    } catch (error) {
      handleError(error, "Erreur lors de l'ajout du coach");
    } finally {
      setLoadingState("addCoachButton", false, "Promouvoir Coach");
    }
  });

// --- LOGIQUE COACH ---

/**
 * Enregistre un nouvel athlète dans le système (Coach uniquement)
 */
document
  .getElementById("registerAthleteButton")
  ?.addEventListener("click", async () => {
    const addr = document.getElementById("regAthleteAddr").value;
    const name = document.getElementById("regAthleteName").value;

    if (!web3.utils.isAddress(addr) || !name)
      return alert("Veuillez remplir correctement les champs.");

    setLoadingState("registerAthleteButton", true, "Inscrire");
    try {
      await contract.methods
        .registerAthlete(addr, name)
        .send({ from: currentAccount });
      alert("Athlète inscrit avec succès !");
      document.getElementById("regAthleteAddr").value = "";
      document.getElementById("regAthleteName").value = "";
      refreshAthleteList();
    } catch (error) {
      handleError(error, "Erreur lors de l'inscription de l'athlète");
    } finally {
      setLoadingState("registerAthleteButton", false, "Inscrire");
    }
  });

/**
 * Crée une attestation de performance (NFT) pour un athlète (Coach uniquement)
 */
document
  .getElementById("createAttestationButton")
  ?.addEventListener("click", async () => {
    const athlete = document.getElementById("athleteAddr").value;
    const sport = document.getElementById("sportName").value;
    const type = document.getElementById("perfType").value;
    const score = document.getElementById("perfScore").value;
    const unit = document.getElementById("perfUnit").value;

    if (!web3.utils.isAddress(athlete) || !sport || !type || !score) {
      return alert("Veuillez remplir tous les champs correctement.");
    }

    setLoadingState("createAttestationButton", true, "Signer le Record");
    try {
      await contract.methods
        .createAttestation(athlete, sport, type, score, unit)
        .send({ from: currentAccount });
      alert("Record certifié sur la blockchain !");
      refreshAthleteList();
    } catch (error) {
      handleError(error, "Erreur lors de la création de l'attestation");
    } finally {
      setLoadingState("createAttestationButton", false, "Signer le Record");
    }
  });

/**
 * Révoque (brûle) une attestation existante (Coach uniquement)
 */
document
  .getElementById("revokeAttestationButton")
  ?.addEventListener("click", async () => {
    const athlete = document.getElementById("revokeAthleteAddr").value;
    const tokenId = document.getElementById("revokeTokenId").value;

    if (!web3.utils.isAddress(athlete) || !tokenId)
      return alert("Veuillez remplir l'adresse et l'ID du token.");
    if (
      !confirm(
        "Attention : Cette action va BRÛLER le NFT. Opération irréversible. Continuer ?",
      )
    )
      return;

    setLoadingState("revokeAttestationButton", true, "Révoquer NFT");
    try {
      await contract.methods
        .revokeAttestation(athlete, tokenId)
        .send({ from: currentAccount });
      alert("Attestation révoquée et NFT détruit !");
      document.getElementById("revokeTokenId").value = "";
      refreshAthleteList();
    } catch (error) {
      handleError(error, "Erreur lors de la révocation du record");
    } finally {
      setLoadingState("revokeAttestationButton", false, "Révoquer NFT");
    }
  });

/**
 * Affiche la liste des athlètes inscrits et leurs performances respectives
 */
async function refreshAthleteList() {
  const tbody = document.getElementById("athleteTableBody");
  try {
    // Récupération des événements d'inscription
    const events = await contract.getPastEvents("AthleteRegistered", {
      fromBlock: 0,
      toBlock: "latest",
    });

    // Déduplication via un Map (garde la dernière version du nom pour une adresse donnée)
    const athletesMap = new Map();
    events.forEach((e) =>
      athletesMap.set(e.returnValues.athlete, e.returnValues.name),
    );

    if (athletesMap.size === 0) {
      tbody.innerHTML = "<tr><td colspan='2'>Aucun athlète trouvé.</td></tr>";
      return;
    }

    // Récupération groupée des performances pour chaque athlète
    const athleteEntries = Array.from(athletesMap.entries());
    const athletesData = await Promise.all(
      athleteEntries.map(async ([addr, name]) => {
        const atts = await contract.methods.getAthleteAttestations(addr).call();
        return { addr, name, atts };
      }),
    );

    tbody.innerHTML = athletesData
      .map(
        (data) => `
      <tr>
        <td>
          <strong>${data.name}</strong><br>
          <small style="color:var(--text-muted); cursor:pointer;" onclick="copyToForm('${data.addr}')" title="Copier l'adresse">${data.addr.substring(0, 10)}... 📋</small>
        </td>
        <td>
          <button class="btn-small" onclick="toggleHistory('${data.addr}')">
            ${data.atts.length} Performance(s) ▼
          </button>
        </td>
      </tr>
      <tr id="history-${data.addr}" class="hidden">
        <td colspan="2" style="background: #f8fafc; padding: 10px;">
          <div class="history-inner">
            ${
              data.atts.length > 0
                ? data.atts
                    .map(
                      (a) => `
                  <div style="font-size:0.8rem; border-bottom:1px solid #eee; padding:5px 0;">
                    <b>${a.sport} (${a.performanceType})</b>: ${a.score} ${a.unit} (Token #${a.tokenId})
                  </div>
                `,
                    )
                    .join("")
                : "Aucun record enregistré."
            }
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (e) {
    console.error("Erreur lors du rafraîchissement de la liste athlètes :", e);
  }
}

/**
 * Affiche/Masque le détail des performances d'un athlète
 * @param {string} addr - Adresse de l'athlète
 */
window.toggleHistory = function (addr) {
  const el = document.getElementById(`history-${addr}`);
  if (el) el.classList.toggle("hidden");
};

/**
 * Utilitaire pour pré-remplir les formulaires de création/révocation
 * @param {string} addr - Adresse à copier
 */
window.copyToForm = function (addr) {
  document.getElementById("athleteAddr").value = addr;
  document.getElementById("revokeAthleteAddr").value = addr;
  document.getElementById("searchAthleteAddr").value = addr;
};

// --- LOGIQUE ATHLÈTE ET RECHERCHE ---

/**
 * Charge le tableau de bord personnel de l'athlète (ses NFTs)
 * @param {string} name - Nom de l'athlète
 */
async function loadAthleteDashboard(name) {
  const container = document.getElementById("myAttestationsProfile");
  try {
    const atts = await contract.methods
      .getAthleteAttestations(currentAccount)
      .call();

    if (atts.length === 0) {
      container.innerHTML = "<p>Aucun record certifié pour le moment.</p>";
      return;
    }

    container.innerHTML = atts
      .map(
        (r) => `
      <div class="nft-card">
        <div class="nft-header">
          <span class="nft-id">ID NFT: #${r.tokenId}</span>
          <span class="nft-sport">${r.sport}</span>
        </div>
        <div class="nft-body">
          <div class="nft-score">${r.score} ${r.unit}</div>
          <div class="nft-type">${r.performanceType}</div>
        </div>
        <div class="nft-footer">
          <button class="primary-action" style="padding: 8px; font-size: 0.8rem;" 
            onclick="generateCertificate('${name}', '${r.sport}', '${r.performanceType}', '${r.score}', '${r.unit}', '${r.tokenId}')">
            💾 Télécharger le Certificat
          </button>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Erreur chargement Dashboard:", error);
  }
}

/**
 * Permet de rechercher et d'afficher les performances de n'importe quel athlète par son adresse
 */
document
  .getElementById("getAttestationsButton")
  .addEventListener("click", async () => {
    const addr = document.getElementById("searchAthleteAddr").value;
    const list = document.getElementById("attestationsList");

    if (!web3.utils.isAddress(addr)) return alert("Adresse Ethereum invalide.");

    setLoadingState("getAttestationsButton", true, "Consulter");
    try {
      const [name, atts] = await Promise.all([
        contract.methods.getAthleteName(addr).call(),
        contract.methods.getAthleteAttestations(addr).call(),
      ]);

      list.innerHTML =
        `<h3>Records de ${name || "Athlète Inconnu"}</h3>` +
        (atts.length > 0
          ? atts
              .map(
                (r) =>
                  `<div class="feed-item" style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${r.sport} (${r.performanceType})</strong> : ${r.score} ${r.unit}</div>`,
              )
              .join("")
          : "<p>Aucun record trouvé pour cette adresse.</p>");
    } catch (error) {
      handleError(error, "Erreur lors de la recherche du palmarès");
    } finally {
      setLoadingState("getAttestationsButton", false, "Consulter");
    }
  });

// --- GÉNÉRATION CANVAS ---

/**
 * Génère une image PNG (certificat) à partir des données de performance
 * @param {string} name - Nom de l'athlète
 * @param {string} sport - Catégorie sportive
 * @param {string} type - Nom de l'épreuve
 * @param {string} score - Valeur réalisée
 * @param {string} unit - Unité de mesure
 * @param {string} id - Token ID du NFT
 */
window.generateCertificate = function (name, sport, type, score, unit, id) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  // Fond et bordure
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1000, 700);
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 15;
  ctx.strokeRect(30, 30, 940, 640);

  // Titre principal
  ctx.fillStyle = "#3b82f6";
  ctx.font = "bold 45px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICAT DE RÉUSSITE", 500, 120);

  // Nom de l'athlète
  ctx.fillStyle = "#64748b";
  ctx.font = "24px Arial";
  ctx.fillText("Décerné à l'athlète", 500, 200);
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 55px Arial";
  ctx.fillText(name, 500, 280);

  // Détails Sport/Épreuve
  ctx.fillStyle = "#64748b";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`${sport.toUpperCase()}`, 500, 360);

  ctx.fillStyle = "#1e293b";
  ctx.font = "24px Arial";
  ctx.fillText(`Épreuve : ${type}`, 500, 400);

  // Score mis en avant
  ctx.fillStyle = "#3b82f6";
  ctx.font = "bold 90px Arial";
  ctx.fillText(`${score} ${unit}`, 500, 520);

  // Pied de page technique
  ctx.fillStyle = "#94a3b8";
  ctx.font = "italic 18px Arial";
  ctx.fillText(
    `Certifié sur la Blockchain SportChain - NFT ID #${id}`,
    500,
    630,
  );

  // Déclenchement du téléchargement
  const link = document.createElement("a");
  link.download = `SportChain_Certificat_${id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

// --- INITIALISATION DES MENUS DÉROULANTS ---

/**
 * Initialise la logique des menus déroulants liés aux sports (cascade Sport -> Épreuve -> Unité)
 */
function initSportSelects() {
  const sSelect = document.getElementById("sportName");
  const tSelect = document.getElementById("perfType");
  const uInput = document.getElementById("perfUnit");

  // Remplissage du premier select (Sport)
  Object.keys(sportsData).forEach((s) => sSelect.add(new Option(s, s)));

  // Mise à jour du second select (Épreuve) quand le sport change
  sSelect.addEventListener("change", () => {
    tSelect.innerHTML = '<option value="">Épreuve...</option>';
    uInput.value = "";
    if (sSelect.value) {
      tSelect.disabled = false;
      Object.keys(sportsData[sSelect.value]).forEach((t) =>
        tSelect.add(new Option(t, t)),
      );
    } else {
      tSelect.disabled = true;
    }
  });

  // Mise à jour de l'unité quand l'épreuve change
  tSelect.addEventListener("change", () => {
    if (tSelect.value) {
      uInput.value = sportsData[sSelect.value][tSelect.value];
    } else {
      uInput.value = "";
    }
  });
}
