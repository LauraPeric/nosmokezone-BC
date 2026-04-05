const hre = require("hardhat");

async function main() {

  // 1. Deploy SmokeFreeBadges
  const Badge = await hre.ethers.getContractFactory("SmokeFreeBadges");
  const badge = await Badge.deploy();
  await badge.waitForDeployment();

  console.log("SmokeFreeBadges deployed at:", badge.target);


  // 2. Deploy NoSmokeNFT - proslijedivanje adrese badge contractaa
  const NoSmoke = await hre.ethers.getContractFactory("NoSmokeNFT");
  const noSmoke = await NoSmoke.deploy(badge.target);
  await noSmoke.waitForDeployment();

  console.log("NoSmokeNFT deployed at:", noSmoke.target);


  // 3. povezivanje contracta
  const tx = await badge.setNoSmokeContract(noSmoke.target);
  await tx.wait();

  console.log("Contracts connected successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});