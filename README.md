# NoSmokeZone – Blockchain Aplikacija

**Fakultet:** Fakultet informatike u Puli  
**Kolegij:** Blockchain aplikacije  
**Nositelj kolegija:** doc. dr. sc. Nikola Tanković  
**Asistent:** Luka Sever, mag. inf.  
**Student:** Laura Perić

---
## 🚀 Pregled projekta
NoSmokeZone je decentralizirana blockchain aplikacija osmišljena za poticanje prestanka pušenja kroz gamifikaciju. Koristi pametne ugovore na Ethereum (Sepolia) mreži za praćenje napretka korisnika i dodjelu NFT nagrada, uz React frontend za interakciju s korisnikom.

## 🧠 Opis projekta

**NoSmokeZone** je decentralizirana blockchain aplikacija čiji je cilj potaknuti korisnike na prestanak pušenja kroz gamifikaciju u obliku NFT nagrada. Sustav omogućuje korisnicima praćenje osobnog “streaka” (uzastopnih dana bez pušenja) te automatsko dobivanje NFT bedževa kada dosegnu određene milestone-ove.

Aplikacija se sastoji od:
* frontend dijela razvijenog u **Reactu**
* smart contracta implementiranih u **Solidity jeziku** koji su deployani na **Sepolia testnet**

Interakcija s blockchainom ostvaruje se putem **MetaMask walleta**.

Sustav ne koristi klasični backend server, već se oslanja na decentraliziranu logiku izvršavanja putem smart contracta.

---

## 🛠 Korištene tehnologije i servisi

### Frontend: React (JavaScript, HTML, CSS)

Aplikacija je razvijena u React frameworku koji omogućuje izgradnju dinamičkog korisničkog sučelja. Frontend upravlja:
* stanjem aplikacije  
* interakcijom s korisnikom  
* komunikacijom sa smart contractom putem Web3 biblioteka (npr. ethers.js)

### Blockchain: Ethereum Sepolia Testnet

Za razvoj i testiranje koristi se Ethereum Sepolia test mreža koja omogućuje besplatno testiranje transakcija bez stvarnog troška. Smart contracti su deployani na ovoj mreži i dostupni putem javnih adresa.

### Smart Contracts: Solidity

Logika aplikacije implementirana je u Solidity pametnim ugovorima:

* **NoSmokeNFT** – upravlja streak logikom i interakcijom s badge contractom  
* **SmokeFreeBadges** – upravlja mintanjem NFT nagrada i metadata URI-jevima  

### Wallet integracija: MetaMask

Korisnici se autentificiraju i potpisuju transakcije putem MetaMask walleta. MetaMask omogućuje sigurno upravljanje privatnim ključevima i interakciju s blockchainom.

### Pohrana metadata: IPFS

NFT metadata (JSON datoteke i slike) pohranjuju se na **IPFS (InterPlanetary File System)**, što omogućuje decentraliziranu i trajnu pohranu sadržaja povezanog s NFT-ovima.

---

## 🎯 Glavne funkcionalnosti

* ✅ Povezivanje MetaMask walleta  
* ✅ Praćenje korisničkog streaka bez pušenja  
* ✅ Manualno označavanje dana bez pušenja (“mark smoke free”)  
* ✅ Reset streaka u slučaju “slip-up” događaja  
* ✅ Automatsko mintanje NFT bedževa pri milestone-ovima (1, 7, 15, 30, 60 dana)  
* ✅ Pregled korisničkih NFT-ova  
* ✅ Interakcija sa smart contractom putem blockchain transakcija  

---

## 🧩 Pregled komponenti sustava

| Komponenta | Opis funkcionalnosti |
|------------|---------------------|
| React frontend | Korisničko sučelje aplikacije |
| NoSmokeNFT smart contract | Upravljanje streak logikom i milestone provjerama |
| SmokeFreeBadges smart contract | Mintanje NFT bedževa i metadata |
| MetaMask | Upravljanje walletom i potpisivanje transakcija |
| Sepolia testnet | Blockchain mreža za deploy i testiranje |
| IPFS | Decentralizirana pohrana NFT metadata |

---

## ⚙️ Pokretanje aplikacije

Aplikacija će se pokrenuti na:

http://localhost:3000

---

### 📁 Pokretanje frontend aplikacije

```bash
cd frontend
npm install
npm start
```
---
### 📁 Deploy smart contracta (Hardhat)

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
Nakon deploya dobiva se adresa smart contracta koja se koristi u frontend konfiguraciji.

---

### 📁 Konfiguracija frontend-a

U frontend projektu potrebno je postaviti:

```bash
CONTRACT_ADDRESS
CONTRACT_ABI
```
Nakon toga povezati MetaMask wallet na Sepolia network.

---

### 🔗 Interakcija sa sustavom

Korisnik:

* Povezuje MetaMask wallet
* Klikne “Mark Smoke Free” → šalje transakciju
* Smart contract povećava streak
* Ako je milestone dosegnut → minta NFT
* NFT se prikazuje u korisničkom sučelju

U slučaju “slip-up” događaja:

* korisnik resetira streak putem transakcije
* stanje se ažurira na blockchainu

---

### 🧠 Zaključak

NoSmokeZone predstavlja decentraliziranu aplikaciju koja koristi blockchain tehnologiju za transparentno i sigurno praćenje korisničkog napretka. Korištenjem smart contracta eliminira se potreba za centraliziranim backendom, dok NFT bedževi služe kao digitalna motivacija i dokaz postignuća.

Aplikacija demonstrira primjenu Web3 tehnologija u stvarnom scenariju kroz kombinaciju React frontend-a, Ethereum blockchaina, smart contracta i IPFS-a.
