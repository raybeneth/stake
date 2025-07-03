// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ETHStaking is Ownable {
    // 存储账户质押信息
    mapping(address => StakeInfo) public stakes;
    
    // 质押信息结构体
    struct StakeInfo {
        uint256 amount;    // 质押金额
        uint256 startTime; // 质押开始区块时间
    }
    
    // 查询返回结构体
    struct StakeInfoDTO {
        uint256 stakedAmount; // 质押金额（真实）
        uint256 rewardAmount; // 收益金额（虚拟）
        uint256 totalAmount;  // 总金额（真实+虚拟）
    }

    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed owner, uint256 amount, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice 质押ETH
     */
    function stake() external payable {
        require(msg.value > 0, "Cannot stake 0 ETH");
        // 指向存储
        StakeInfo storage info = stakes[msg.sender];
        if (info.amount > 0) {
            // 更新现有质押
            info.amount = info.amount + msg.value;
        } else {
            // 创建新质押
            stakes[msg.sender] = StakeInfo({
                amount: msg.value,
                startTime: block.timestamp
            });
        }
        emit Staked(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice 提取质押本金和收益
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawn(owner(), balance, block.timestamp);
    }

    /**
     * @notice 计算用户收益
     * @param user 用户地址
     * @return reward 收益金额(wei)
     * @return total 本金+收益(wei)
     */
    function calculateReward(address user) public view returns (uint256 reward, uint256 total) {
        StakeInfo memory info = stakes[user];
        if (info.amount == 0) return (0, 0);
        uint256 effectiveDays = (block.timestamp - info.startTime) / 86400;
        
        // 每日0.5%利率 (0.5% = 5/1000)
        reward = (info.amount * effectiveDays * 5) / 1000;
        total = info.amount + reward;
    }

    /**
     * @notice 获取用户质押信息
     */
    function getStakingInfo() public view returns (StakeInfoDTO memory) {
        StakeInfo memory info = stakes[msg.sender];
        if (info.amount == 0) {
            return StakeInfoDTO({
                stakedAmount: 0,
                rewardAmount: 0,
                totalAmount: 0
            });
        }
        (uint256 reward, uint256 total) = calculateReward(msg.sender);
        return StakeInfoDTO({
            stakedAmount: info.amount,
            rewardAmount: reward,
            totalAmount: total
        });
    }
}