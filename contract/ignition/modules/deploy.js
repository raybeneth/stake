const hre = require("hardhat");

async function main() {
    const ownerAddress = '';
    const factory = await hre.ethers.getContractFactory("ETHStaking");
    const contract = await factory.deploy(ownerAddress);
    await contract.waitForDeployment();
    console.log(`合约已部署到: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 