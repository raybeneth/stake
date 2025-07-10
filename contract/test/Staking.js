const hre = require("hardhat");

async function main() {
  // 替换为你部署的合约地址
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const { ethers } = hre;

  // 获取合约余额（单位是 wei）
  const balanceWei = await ethers.provider.getBalance(contractAddress);
  console.log(`合约地址 ${contractAddress} 的余额（wei）: ${balanceWei.toString()}`);
  // 转换成 ether（1 ether = 1e18 wei）
  const balanceEth = ethers.formatEther(balanceWei);

  console.log(`合约地址: ${contractAddress}`);
  console.log(`当前 ETH 余额: ${balanceEth} ETH`);
}


async function getContractBalance() {
  const { ethers, hre } = require("hardhat"); // 确保引入 hardhat

  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // ✅ 使用 await 加载合约工厂（包含 ABI）
  const Staking = await ethers.getContractFactory("ETHStaking");

  // ✅ 创建只读合约实例
  const address = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
  const contract = new ethers.Contract(
    contractAddress,
    Staking.interface, // ✅ interface 包含 ABI
    ethers.provider
  );

    // 创建带签名者的合约实例（因为我们要模拟 msg.sender）
  const signer = await ethers.provider.getSigner(address); // 使用指定地址作为调用者
  const contractWithSigner = contract.connect(signer);

   // 调用 view 函数，并传入地址参数
  const info = await contractWithSigner.getStakingInfo();
  console.log("完整返回值:", info);
  // 打印结果
  console.log("查询地址:", address);
  console.log("质押金额:", ethers.formatEther(info.stakedAmount));
  console.log("奖励:", ethers.formatEther(info.rewardAmount));
  console.log("all (wei):", ethers.formatEther(info.totalAmount));
}

getContractBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });