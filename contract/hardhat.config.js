require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "dev",  // or "sepolia" if deploying to sepolia
  networks: {
    hardhat: {},
    dev: {
      url: "https://6f43-112-10-132-49.ngrok-free.app", // Make sure this is correctly forwarding to localhost:8545
      chainId: 31337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/v_M5F7Wmq6bElNsaxQYnt",
      accounts: ['48dcc44a4fa250e46f29ca25386326e0a5f3215306ef3648aea8caf8bb36b9f3']
    }
  },
};