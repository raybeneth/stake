// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ETHStaking is Ownable {
    // 存储账户质押信息
    mapping(address => StakeInfo) public stakes;
    
    // 质押信息结构体
    struct StakeInfo {
        bool exists;
        uint256 amount;
        uint256 startTime;
    }
    
    // 查询返回结构体
    struct StakeInfoDTO {
        uint256 stakedAmount;
        uint256 rewardAmount;
        uint256 totalAmount;
    }

    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 stakedAmount, uint256 reward, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice 质押ETH
     */
    function stake() external payable {
        require(msg.value > 0, "Cannot stake 0 ETH");
        
        StakeInfo storage info = stakes[msg.sender];
        
        if (info.exists) {
            // 更新现有质押
            (uint256 pendingReward, ) = calculateReward(msg.sender);
            info.amount += msg.value + pendingReward;
            info.startTime = block.timestamp;
        } else {
            // 创建新质押
            stakes[msg.sender] = StakeInfo({
                exists: true,
                amount: msg.value,
                startTime: block.timestamp
            });
        }
        
        emit Staked(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice 提取质押本金和收益
     */
    function withdraw() external {
        StakeInfo storage info = stakes[msg.sender];
        require(info.exists, "No active stake");
        
        (uint256 reward, uint256 total) = calculateReward(msg.sender);
        uint256 stakedAmount = info.amount;
        
        // 重置质押信息
        delete stakes[msg.sender];
        
        // 发送ETH
        (bool success, ) = msg.sender.call{value: total}("");
        require(success, "ETH transfer failed");
        
        emit Withdrawn(msg.sender, stakedAmount, reward, block.timestamp);
    }

    /**
     * @notice 计算用户收益
     * @param user 用户地址
     * @return reward 收益金额(wei)
     * @return total 本金+收益(wei)
     */
    function calculateReward(address user) public view returns (uint256 reward, uint256 total) {
        StakeInfo memory info = stakes[user];
        if (!info.exists) return (0, 0);
        uint256 effectiveDays = (block.timestamp - info.startTime) / 86400;
        
        // 每日0.5%利率 (0.5% = 5/1000)
        reward = (info.amount * effectiveDays * 5) / 1000;
        total = info.amount + reward;
    }

    /**
     * @notice 获取用户质押信息
     */
    function getStakingInfo() public view returns (StakeInfoDTO memory) {
        (uint256 reward, uint256 total) = calculateReward(msg.sender);
        StakeInfo memory info = stakes[msg.sender];
        return StakeInfoDTO({
            stakedAmount: info.amount,
            rewardAmount: reward,
            totalAmount: total
        });
    }

    /**
     * @notice 仅限合约所有者提取错误发送的ETH
     */
    function rescueETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}