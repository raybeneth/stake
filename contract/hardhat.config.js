require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    LOCAL: {
      url: "https://hardhat.coder-api.cn",
      chainId: 31337,
    },
  },
};
