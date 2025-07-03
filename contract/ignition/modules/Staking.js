const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // 1. 获取合约工厂
    const factory = await ethers.getContractFactory("ETHStaking");

    // 2. 构造部署参数
    const salt = ethers.id("kangoshy999"); // 可自定义salt
    const bytecode = factory.bytecode;
    const constructorTypes = [];
    const constructorArgs = [];
    const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(constructorTypes, constructorArgs);
    const initCode = bytecode + encodedArgs.slice(2);

    // 3. 正确获取 deployer 地址
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const create2Address = ethers.getCreate2Address(
        deployerAddress,
        salt,
        ethers.keccak256(initCode)
    );
    console.log(`预计算的合约地址: ${create2Address}`);

    // 4. 使用CREATE2部署
    // 需要有一个CREATE2工厂合约，Hardhat本身不直接支持，需要用官方的Create2Deployer合约
    // 这里假设你已经部署了Create2Deployer合约，地址为create2DeployerAddress
    // 你可以用 https://github.com/Arachnid/deterministic-deployment-proxy
    // 下面是伪代码，实际部署需要你有Create2Deployer合约

    // const create2Deployer = await ethers.getContractAt("Create2Deployer", create2DeployerAddress);
    // const tx = await create2Deployer.deploy(0, salt, initCode);
    // await tx.wait();
    // console.log(`合约已通过CREATE2部署到: ${create2Address}`);

    // 如果没有Create2Deployer合约，可以用 hardhat-deploy 插件或手动部署
    // 这里只输出预计算地址
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});