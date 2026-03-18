/**
 * @file app.js
 * @version 1.1.0
 * @description Script de gestion de l'interface SportChain Pro.
 * Assure la liaison entre l'injection Ethereum (MetaMask) et le Smart Contract.
 */

const contractAddress = "0x7c99A6A63D68A2778B54DD0503A3C773833ff378";
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
        name: "athlete",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "themeId",
        type: "uint256",
      },
    ],
    name: "ThemePurchased",
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
    inputs: [],
    name: "THEME_PREMIUM_PRICE",
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
        internalType: "uint256",
        name: "_themeId",
        type: "uint256",
      },
    ],
    name: "buyTheme",
    outputs: [],
    stateMutability: "payable",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hasTheme",
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
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * @constant {Object} sportsData
 * @description Référentiel des sports, épreuves et unités de mesure associées.
 */
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

let web3, contract, currentAccount;

/**
 * @event window#load
 * @description Initialise la connexion Web3 et configure les écouteurs de changement de compte.
 */
window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
    initSportSelects();
    setupEventListeners();

    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        updateAccountUI();
        resetUI();
        checkPermissions();
      } else {
        window.location.reload();
      }
    });
  } else {
    alert("Veuillez installer MetaMask.");
  }
});

/**
 * @function updateAccountUI
 * @description Met à jour l'affichage de l'adresse utilisateur (format court).
 */
function updateAccountUI() {
  const area = document.getElementById("accountArea");
  area.innerText = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
}

/**
 * @function displayNotification
 * @param {string} message - Texte à afficher dans le toast.
 * @description Génère une notification visuelle temporaire en haut de l'écran.
 */
function displayNotification(message) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = `<strong>🏆 SportChain Live :</strong> <br> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

/**
 * @function resetUI
 * @description Masque tous les blocs d'interface spécifiques aux rôles.
 */
function resetUI() {
  ["block-admin", "block-coach", "block-athlete"].forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
}

/**
 * @function handleError
 * @param {Error} error - L'objet d'erreur capturé.
 * @param {string} customMessage - Message contextuel pour l'utilisateur.
 * @description Log l'erreur en console et affiche une alerte détaillée.
 */
function handleError(error, customMessage) {
  console.error(error);
  const msg = error.reason || error.message || "Erreur inconnue";
  alert(`${customMessage} : ${msg}`);
}

/**
 * @description Gère la demande de connexion initiale via MetaMask.
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
    handleError(error, "Erreur de connexion");
  }
});

/**
 * @function checkPermissions
 * @description Vérifie le rôle de l'utilisateur (Admin, Coach, Athlète) et affiche les menus correspondants.
 */
async function checkPermissions() {
  try {
    const adminAddr = await contract.methods.admin().call();
    const isCoach = await contract.methods.isCoach(currentAccount).call();
    const athleteName = await contract.methods
      .getAthleteName(currentAccount)
      .call();

    if (currentAccount.toLowerCase() === adminAddr.toLowerCase()) {
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
    console.error("Erreur permissions", e);
  }
  updateShopUI();
}

/**
 * @function purchaseTheme
 * @param {number} themeId - L'ID du thème à acheter.
 * @description Appelle la fonction de paiement du contrat pour débloquer un design de certificat.
 */
window.purchaseTheme = async function (themeId) {
  try {
    const price = await contract.methods.THEME_PREMIUM_PRICE().call();
    await contract.methods
      .buyTheme(themeId)
      .send({ from: currentAccount, value: price });
    displayNotification("✨ Thème débloqué avec succès !");
    updateShopUI();
  } catch (error) {
    handleError(error, "Échec de l'achat");
  }
};

/**
 * @function loadAthleteDashboard
 * @param {string} name - Nom de l'athlète pour le rendu.
 * @description Récupère les NFT de performance et les affiche avec le thème possédé.
 */
async function loadAthleteDashboard(name) {
  const container = document.getElementById("myAttestationsProfile");
  try {
    const hasGold = await contract.methods.hasTheme(currentAccount, 1).call();
    const hasCyber = await contract.methods.hasTheme(currentAccount, 2).call();
    const atts = await contract.methods
      .getAthleteAttestations(currentAccount)
      .call();

    container.innerHTML = atts
      .map((r) => {
        let themeClass = "";
        if (hasGold) themeClass = "theme-gold";
        if (hasCyber) themeClass = "theme-cyber";

        const safeName = name.replace(/'/g, "\\'");
        return `
        <div class="nft-card ${themeClass}">
          <div class="nft-header"><span>#${r.tokenId}</span> <span>${r.sport}</span></div>
          <div class="nft-score">${r.score} ${r.unit}</div>
          <div class="nft-type">${r.performanceType}</div>
          <button class="primary-action" onclick="generateCertificate('${safeName}','${r.sport}','${r.performanceType}','${r.score}','${r.unit}','${r.tokenId}')">
            💾 Télécharger PNG
          </button>
        </div>`;
      })
      .join("");
  } catch (e) {
    console.error("Erreur chargement dashboard:", e);
  }
}

/**
 * @function generateCertificate
 * @description Dessine un certificat sur un Canvas HTML5 en fonction du thème possédé et lance le téléchargement.
 */
window.generateCertificate = async function (
  name,
  sport,
  type,
  score,
  unit,
  id,
) {
  const hasGold = await contract.methods.hasTheme(currentAccount, 1).call();
  const hasCyber = await contract.methods.hasTheme(currentAccount, 2).call();

  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  // --- RENDU DU FOND ---
  if (hasGold) {
    let grad = ctx.createLinearGradient(0, 0, 1000, 700);
    grad.addColorStop(0, "#bf953f");
    grad.addColorStop(0.5, "#fcf6ba");
    grad.addColorStop(1, "#aa771c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 700);
  } else if (hasCyber) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1000, 700);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#3b82f6";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 940, 640);
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1000, 700);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, 960, 660);
  }

  // --- TEXTES ---
  ctx.fillStyle = hasCyber ? "#60a5fa" : "#1e293b";
  ctx.textAlign = "center";

  ctx.font = "bold 40px Arial";
  ctx.fillText("SPORTCHAIN PRO - CERTIFICAT OFFICIEL", 500, 100);

  ctx.font = "30px Arial";
  ctx.fillText("Cette attestation certifie la performance de :", 500, 220);

  ctx.font = "bold 60px Arial";
  ctx.fillText(name.toUpperCase(), 500, 300);

  ctx.font = "35px Arial";
  ctx.fillText(`${sport} - ${type}`, 500, 400);

  ctx.font = "bold 100px Arial";
  ctx.fillText(`${score} ${unit}`, 500, 520);

  ctx.font = "italic 20px Arial";
  ctx.fillText(`Certifié sur Ethereum - Token #${id}`, 500, 640);

  // --- LOGIQUE DE TÉLÉCHARGEMENT ---
  try {
    // Conversion du canvas en image base64
    const imageURL = canvas.toDataURL("image/png");

    // Création d'un lien invisible pour forcer le téléchargement
    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = `Certificat_SportChain_${id}.png`;

    // Déclenchement du clic
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    displayNotification("✅ Certificat téléchargé !");
  } catch (err) {
    handleError(err, "Erreur lors de la génération de l'image");
  }
};

/**
 * @function setupEventListeners
 * @description Configure tous les triggers de boutons pour les interactions avec le contrat.
 */
function setupEventListeners() {
  document
    .getElementById("registerAthleteButton")
    .addEventListener("click", async () => {
      const addr = document.getElementById("regAthleteAddr").value;
      const name = document.getElementById("regAthleteName").value;
      try {
        await contract.methods
          .registerAthlete(addr, name)
          .send({ from: currentAccount });
        displayNotification(`Athlète ${name} enregistré !`);
        await refreshAthleteList();
        document.getElementById("regAthleteAddr").value = "";
        document.getElementById("regAthleteName").value = "";
      } catch (e) {
        handleError(e, "Erreur d'inscription");
      }
    });

  document
    .getElementById("createAttestationButton")
    .addEventListener("click", async () => {
      const addr = document.getElementById("athleteAddr").value;
      const sport = document.getElementById("sportName").value;
      const type = document.getElementById("perfType").value;
      const score = document.getElementById("perfScore").value;
      const unit = document.getElementById("perfUnit").value;
      try {
        await contract.methods
          .createAttestation(addr, sport, type, score, unit)
          .send({ from: currentAccount });
        displayNotification("Record certifié sur la blockchain !");
      } catch (e) {
        handleError(e, "Erreur de certification");
      }
    });

  document
    .getElementById("getAttestationsButton")
    .addEventListener("click", async () => {
      const addr = document.getElementById("searchAthleteAddr").value;
      const listDiv = document.getElementById("attestationsList");
      try {
        const name = await contract.methods.getAthleteName(addr).call();
        const atts = await contract.methods.getAthleteAttestations(addr).call();
        if (atts.length === 0) {
          listDiv.innerHTML = "<p>Aucun record trouvé pour cette adresse.</p>";
          return;
        }
        listDiv.innerHTML =
          `<h3>Palmarès de ${name}</h3><div class="nft-grid">` +
          atts
            .map(
              (r) => `
          <div class="nft-card">
            <div class="nft-header"><span>#${r.tokenId}</span></div>
            <div class="nft-score">${r.score} ${r.unit}</div>
            <div class="nft-type">${r.sport} - ${r.performanceType}</div>
          </div>
        `,
            )
            .join("") +
          `</div>`;
      } catch (e) {
        handleError(e, "Recherche impossible");
      }
    });

  document
    .getElementById("addCoachButton")
    .addEventListener("click", async () => {
      const addr = document.getElementById("coachAddress").value;
      if (!web3.utils.isAddress(addr)) return alert("Adresse invalide");
      try {
        await contract.methods.addCoach(addr).send({ from: currentAccount });
        displayNotification("Coach accrédité !");
        await refreshCoachList();
        document.getElementById("coachAddress").value = "";
      } catch (e) {
        handleError(e, "Erreur promotion coach");
      }
    });

  document
    .getElementById("revokeAttestationButton")
    .addEventListener("click", async () => {
      const addr = document.getElementById("revokeAthleteAddr").value;
      const id = document.getElementById("revokeTokenId").value;
      try {
        await contract.methods
          .revokeAttestation(addr, id)
          .send({ from: currentAccount });
        displayNotification("NFT révoqué.");
      } catch (e) {
        handleError(e, "Erreur de révocation");
      }
    });

  contract.events
    .AttestationCreated({ fromBlock: "latest" })
    .on("data", (event) => {
      const { athleteName, sport, score, unit } = event.returnValues;
      displayNotification(
        `${athleteName} a réalisé ${score} ${unit} en ${sport} !`,
      );
    });
}

/**
 * @function refreshAthleteList
 * @description Analyse les événements passés "AthleteRegistered" pour lister les athlètes dans le dashboard Coach.
 */
async function refreshAthleteList() {
  const tbody = document.getElementById("athleteTableBody");
  if (!tbody) return;
  try {
    const events = await contract.getPastEvents("AthleteRegistered", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const rows = events.map(
      (e) => `
      <tr>
        <td><strong>${e.returnValues.name}</strong><br><small>${e.returnValues.athlete}</small></td>
        <td><button class="btn-small" onclick="document.getElementById('athleteAddr').value='${e.returnValues.athlete}'">Sélectionner</button></td>
      </tr>
    `,
    );
    tbody.innerHTML =
      rows.join("") || "<tr><td colspan='2'>Aucun athlète inscrit.</td></tr>";
  } catch (error) {
    console.error("Erreur liste athlètes:", error);
  }
}

/**
 * @function refreshCoachList
 * @description Récupère les coachs actifs via les logs "CoachAdded" et vérifie leur statut actuel.
 */
async function refreshCoachList() {
  const tbody = document.getElementById("coachTableBody");
  if (!tbody) return;
  tbody.innerHTML = "<tr><td colspan='3'>Chargement...</td></tr>";
  try {
    const events = await contract.getPastEvents("CoachAdded", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const uniqueCoaches = [...new Set(events.map((e) => e.returnValues.coach))];
    let html = "";
    for (const coachAddr of uniqueCoaches) {
      const isActive = await contract.methods.isCoach(coachAddr).call();
      if (isActive) {
        const coachEvent = events.find(
          (e) => e.returnValues.coach === coachAddr,
        );
        const block = await web3.eth.getBlock(coachEvent.blockNumber);
        const date = new Date(block.timestamp * 1000).toLocaleDateString(
          "fr-FR",
        );
        html += `<tr><td>${coachAddr}</td><td>${date}</td><td><button class="btn-small btn-danger" onclick="removeCoachAction('${coachAddr}')">Révoquer</button></td></tr>`;
      }
    }
    tbody.innerHTML =
      html || "<tr><td colspan='3'>Aucun coach actif.</td></tr>";
  } catch (error) {
    console.error(error);
  }
}

/**
 * @function removeCoachAction
 * @param {string} addr - Adresse du coach à révoquer.
 * @description (Admin) Révoque les droits d'un coach sur le contrat.
 */
window.removeCoachAction = async function (addr) {
  try {
    await contract.methods.removeCoach(addr).send({ from: currentAccount });
    displayNotification("Coach révoqué.");
    refreshCoachList();
  } catch (e) {
    handleError(e, "Erreur lors de la révocation");
  }
};

/**
 * @function initSportSelects
 * @description Peuple dynamiquement les listes déroulantes de sports et épreuves.
 */
function initSportSelects() {
  const sSelect = document.getElementById("sportName");
  const tSelect = document.getElementById("perfType");
  const uInput = document.getElementById("perfUnit");

  Object.keys(sportsData).forEach((s) => sSelect.add(new Option(s, s)));

  sSelect.addEventListener("change", () => {
    tSelect.innerHTML = '<option value="">Épreuve...</option>';
    if (sSelect.value) {
      tSelect.disabled = false;
      Object.keys(sportsData[sSelect.value]).forEach((t) =>
        tSelect.add(new Option(t, t)),
      );
    }
  });

  tSelect.addEventListener("change", () => {
    if (tSelect.value) uInput.value = sportsData[sSelect.value][tSelect.value];
  });
}

/**
 * @function updateShopUI
 * @description Vérifie la possession des thèmes et désactive les boutons d'achat si nécessaire.
 */
async function updateShopUI() {
  const themes = [1, 2];
  for (const id of themes) {
    const card = document.getElementById(`theme-${id}`);
    if (!card) continue;
    try {
      const owned = await contract.methods.hasTheme(currentAccount, id).call();
      const button = card.querySelector("button");
      if (owned) {
        card.classList.add("item-owned");
        button.disabled = true;
        button.innerText = "Déjà possédé";
        button.classList.replace("primary-action", "btn-owned");
      }
    } catch (e) {
      console.error(`Erreur check thème ${id}:`, e);
    }
  }
}
