/**
 * @file app.js
 * @description Logique Front-end SportChain Pro.
 */

// Configuration du Smart Contract
const contractAddress = "0xdDF90911cD5669Eb55cD0aBbf8420040C82D1673";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "athlete",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "AthleteRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "athlete",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "athleteName",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "coach",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "sport",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "performanceType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "unit",
				"type": "string"
			}
		],
		"name": "AttestationCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "athlete",
				"type": "address"
			}
		],
		"name": "AttestationRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "coach",
				"type": "address"
			}
		],
		"name": "CoachAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "coach",
				"type": "address"
			}
		],
		"name": "CoachRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "athlete",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "themeId",
				"type": "uint256"
			}
		],
		"name": "ThemePurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "THEME_PREMIUM_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_coach",
				"type": "address"
			}
		],
		"name": "addCoach",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "athleteNames",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_themeId",
				"type": "uint256"
			}
		],
		"name": "buyTheme",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_athlete",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_sport",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_performanceType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_score",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_unit",
				"type": "string"
			}
		],
		"name": "createAttestation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_athlete",
				"type": "address"
			}
		],
		"name": "getAthleteAttestations",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "athlete",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "sport",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "performanceType",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "score",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "unit",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "coach",
						"type": "address"
					}
				],
				"internalType": "struct PerformanceAttestation.Attestation[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_athlete",
				"type": "address"
			}
		],
		"name": "getAthleteName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hasTheme",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isCoach",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_athlete",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "registerAthlete",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_coach",
				"type": "address"
			}
		],
		"name": "removeCoach",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_athlete",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "revokeAttestation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

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

// --- INITIALISATION ---

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

// --- GESTION DE L'INTERFACE (UX) ---

function updateAccountUI() {
  const area = document.getElementById("accountArea");
  area.innerText = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
}

/**
 * Affiche une notification toast stylisée
 * @param {string} message - Message à afficher
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

function resetUI() {
  ["block-admin", "block-coach", "block-athlete"].forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
}

function handleError(error, customMessage) {
  console.error(error);
  const msg = error.reason || error.message || "Erreur inconnue";
  alert(`${customMessage} : ${msg}`);
}

// --- CONNEXION ---

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

// --- PERMISSIONS ET DASHBOARD ---

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
}

// --- LOGIQUE BOUTIQUE & NFT ---

window.purchaseTheme = async function (themeId) {
  try {
    const price = web3.utils.toWei("0.01", "ether");
    await contract.methods
      .buyTheme(themeId)
      .send({ from: currentAccount, value: price });
    displayNotification("✨ Thème débloqué avec succès !");
  } catch (error) {
    handleError(error, "Échec de l'achat");
  }
};

async function loadAthleteDashboard(name) {
  const container = document.getElementById("myAttestationsProfile");
  try {
    const atts = await contract.methods
      .getAthleteAttestations(currentAccount)
      .call();
    container.innerHTML = atts
      .map(
        (r) => `
      <div class="nft-card">
        <div class="nft-header"><span>#${r.tokenId}</span> <span>${r.sport}</span></div>
        <div class="nft-score">${r.score} ${r.unit}</div>
        <div class="nft-type">${r.performanceType}</div>
        <button class="primary-action" onclick="generateCertificate('${name}','${r.sport}','${r.performanceType}','${r.score}','${r.unit}','${r.tokenId}')">
          💾 Télécharger PNG
        </button>
      </div>
    `,
      )
      .join("");
  } catch (e) {
    console.error(e);
  }
}

// --- GÉNÉRATION DE CERTIFICAT (CANVAS) ---

window.generateCertificate = async function (
  name,
  sport,
  type,
  score,
  unit,
  id,
) {
  const hasGold = await contract.methods.hasTheme(currentAccount, 1).call();
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  // Design dynamique
  if (hasGold) {
    let grad = ctx.createLinearGradient(0, 0, 1000, 700);
    grad.addColorStop(0, "#bf953f");
    grad.addColorStop(0.5, "#fcf6ba");
    grad.addColorStop(1, "#aa771c");
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = "#ffffff";
  }
  ctx.fillRect(0, 0, 1000, 700);

  ctx.strokeStyle = hasGold ? "#ffffff" : "#3b82f6";
  ctx.lineWidth = 15;
  ctx.strokeRect(30, 30, 940, 640);

  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "center";
  ctx.font = "bold 45px Arial";
  ctx.fillText("CERTIFICAT DE RÉUSSITE", 500, 120);
  ctx.font = "bold 55px Arial";
  ctx.fillText(name, 500, 280);
  ctx.font = "bold 90px Arial";
  ctx.fillText(`${score} ${unit}`, 500, 520);

  const link = document.createElement("a");
  link.download = `SportChain_Cert_${id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

// --- LOGIQUE ADMIN / COACH ---

async function refreshCoachList() {
  // Cette fonction devrait normalement itérer sur les événements CoachAdded
  // ou une liste stockée pour peupler le tableau coachTableBody.
}

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

function setupEventListeners() {
  contract.events
    .AttestationCreated({ fromBlock: "latest" })
    .on("data", (event) => {
      const { athleteName, sport, score, unit } = event.returnValues;
      displayNotification(
        `${athleteName} a réalisé ${score} ${unit} en ${sport} !`,
      );
    });
}
