const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Transfer = await hre.ethers.getContractFactory("Transfer");
  const transfer = await Transfer.deploy();

  await transfer.waitForDeployment();

  console.log("Transfer deployed to:", await transfer.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });