const hre = require("hardhat");

async function main() {
  // kreiranje contract factory
  const Contract = await hre.ethers.getContractFactory("NoSmokeNFT");

  // deploy
  const contract = await Contract.deploy();

  // čekaj da deploy završi
  await contract.waitForDeployment();

  console.log("NoSmokeNFT deployed at:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});