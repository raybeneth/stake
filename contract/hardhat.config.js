require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    dev: {
      url: "https://6f43-112-10-132-49.ngrok-free.app",
      chainId: 31337,
    },
  },
};
