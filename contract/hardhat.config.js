require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    LOCAL: {
      url: "https://3650-112-10-132-49.ngrok-free.app",
      chainId: 31337,
    },
  },
};
