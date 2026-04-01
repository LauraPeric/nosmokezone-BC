require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/4tehJENn8X3HsriOwwUxC",
      accounts: ["724752c7ec035f76ff5a661cef5f9ed50ef32aa69991e384d80cd436ee528b3d"]
    }
  }
};