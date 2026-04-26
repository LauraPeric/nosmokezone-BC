# 🚀 NoSmokeZone – Web3 Blockchain Application

NoSmokeZone is a decentralized Web3 application designed to encourage smoking cessation through gamification and NFT rewards.

Users track their smoke-free streak and receive NFT badges when reaching milestone achievements.

The system is built on the Ethereum Sepolia testnet and interacts with smart contracts through a React frontend and MetaMask wallet integration.

This project was developed as part of a university course in Blockchain Applications at the Faculty of Informatics, Juraj Dobrila University of Pula.

---

## 🧠 Project Overview

- Web3 decentralized application (no backend server)
- React frontend for user interaction
- Solidity smart contracts for blockchain logic
- NFT rewards based on user milestones
- Deployed on Ethereum Sepolia testnet
- IPFS used for NFT metadata storage

---

## 🛠 Tech Stack

- **Frontend:** React (JavaScript, HTML, CSS)
- **Smart Contracts:** Solidity
- **Blockchain:** Ethereum Sepolia Testnet
- **Wallet Integration:** MetaMask
- **Storage:** IPFS
- **Web3 Library:** ethers.js

---

## 🎯 Features

- Connect MetaMask wallet
- Track smoke-free streak
- Mark daily progress on-chain
- Reset streak via smart contract
- NFT badge minting at milestones (1, 7, 15, 30, 60 days)
- View collected NFTs in UI

---

## 🧩 System Components

| Component | Description |
|-----------|-------------|
| React Frontend | User interface and blockchain interaction |
| NoSmokeNFT Contract | Manages streak logic |
| SmokeFreeBadges Contract | Handles NFT minting |
| MetaMask | Wallet authentication and transactions |
| Sepolia Testnet | Blockchain network |
| IPFS | Decentralized metadata storage |

---

## 🚀 Run the Project

### Frontend
```bash
cd frontend
npm install
npm start
```

### Deploy Smart Contracts (Hardhat)
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 🔗 How it works

- User connects MetaMask wallet
- User marks a smoke-free day
- Smart contract updates streak on-chain
- NFT is minted when milestone is reached
- NFTs are displayed in the frontend UI

## 👨‍💻 Author

**Laura Perić**  
Full design and implementation of the application
