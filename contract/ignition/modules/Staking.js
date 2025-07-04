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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});