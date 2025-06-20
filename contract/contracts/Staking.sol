// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking is ERC20, Ownable {
    // 存储账户授权额度
    mapping(address => StakeInfo) public authorizedAmount;
    // ERC20代币地址
    address public erc20TokenAddress;
    // 质押信息
    struct StakeInfo {
        uint8 day;
        bool exists;
        address user;
        uint256 amount;
        uint256 timestamp;
    }
    // 质押信息、产生收益等信息
    struct StakeInfoDTO {
        uint8 day;
        uint256 allBalance;
        uint256 balance;
        uint256 reward;
    }

    using SafeERC20 for ERC20;

    constructor() Ownable(msg.sender){
    }

    event Staked(address indexed user, uint256 amount, uint8 day, uint256 timestamp);

    function getStakingInfo(address user) public returns (StakeInfoDTO memory) {
        StakeInfo memory info = authorizedAmount[user];
        // 计算收益 基数*天数*0.005
        uint256 reward = info.amount * (daysBetween(block.timestamp, info.timestamp) * 0.005);
        uint256 allBalance = info.amount + reward;
        return StakeInfoDTO().day(info.day).allBalance(allBalance)
        .balance(info.amount)
        .reward(reward);
    }

    /**
     * 计算两个时间戳之间的天数差
     */
    function daysBetween(uint256 timestampA, uint256 timestampB) public pure returns (uint256) {
        require(timestampA <= type(uint256).max && timestampB <= type(uint256).max, "Timestamps must be valid");

        uint256 earlierTimestamp = timestampA < timestampB ? timestampA : timestampB;
        uint256 laterTimestamp = timestampA > timestampB ? timestampA : timestampB;

        uint256 differenceInSeconds = laterTimestamp - earlierTimestamp;
        uint256 secondsInDay = 24 * 60 * 60;
        return differenceInSeconds / secondsInDay;
    }

    function stake(uint256 _amount, uint8 _day) public returns (bool) {
        require(_amount > 0, "The pledged quantity cannot be zero");
        require(_day >= 7, "The minimum pledge period is 7 days");
        require(erc20TokenAddress != address(0), "Token address not set");

        IERC20 token = IERC20(erc20TokenAddress);
        // 安全地从用户转移代币到合约
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _amount);

        StakeInfo storage info = authorizedAmount[msg.sender];

        if (info.exists) {
            // 如果已有质押，可以选择更新还是拒绝
            // 示例：这里选择更新并覆盖金额（也可以选择叠加）
            info.day = _day;
            info.amount = _amount;
            info.timestamp = block.timestamp;
        } else {
            // 新增质押信息
            authorizedAmount[msg.sender] = StakeInfo({
                day: _day,
                exists: true,
                user: msg.sender,
                amount: _amount,
                timestamp: block.timestamp
            });
        }

        emit Staked(msg.sender, _amount, _day, block.timestamp);
        return true;
    }
}
