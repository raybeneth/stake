const hre = require("hardhat");

async function main() {
    const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const contract = await hre.ethers.deployContract("ETHStaking", [ownerAddress]);
    await contract.waitForDeployment();
    console.log(`合约已部署到: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 