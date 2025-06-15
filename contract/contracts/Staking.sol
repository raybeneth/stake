// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking is ERC20, Ownable {
    // 存储账户授权额度
    mapping(address => uint256) public authorizedAmount;
    // ERC20代币地址
    address public erc20TokenAddress;

    using SafeERC20 for ERC20;

    constructor() Ownable(msg.sender){
    }

    event Staked(address indexed user, uint256 amount, uint256 timestamp);


    function stake(uint256 _amount) public {
        require(_amount > 0, "The pledged quantity cannot be zero");
        // 从用户钱包转移代币到合约（需先授权）
        IERC20(erc20TokenAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        // 记录质押信息
        authorizedAmount[msg.sender] = _amount;
        // 触发质押事件，用于前端监听
        emit Staked(msg.sender, _amount, block.timestamp);
    }

}
