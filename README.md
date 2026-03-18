# 🏅 SportChain Pro - Plateforme de Certification Sportive

Projet de certification de performances sportives utilisant des **Soulbound Tokens (SBT)** sur Ethereum.

## 💡 Concept Technique
* **Contrat :** Standard ERC721 modifié pour interdire les transferts (`_beforeTokenTransfer`).
* **Rôles :** Système d'administration pour valider les coachs et système de certification pour les athlètes.
* **Preuve visuelle :** Génération dynamique de certificats en PNG via le Canvas API.

## 🛠 Procédure de Test (Ganache)
1.  **Déploiement :** Déployez `PerformanceAttestation.sol` via Remix (Injected Provider) sur votre instance Ganache.
2.  **Configuration :** Copiez l'adresse du contrat dans `app.js` (variable `contractAddress`).
3.  **Lancement :** Ouvrez `index.html` avec l'extension VS Code "Live Server".

## 🎭 Scénario de démonstration
1.  **Compte 1 (Admin) :** Ajoutez l'adresse du Compte 2 comme "Coach".
2.  **Compte 2 (Coach) :** Enregistrez le Compte 3 (Athlète) avec son nom, puis créez une attestation (ex: 100m 
Sprint).
3.  **Compte 3 (Athlète) :** Connectez-vous pour voir votre NFT et télécharger votre certificat.
