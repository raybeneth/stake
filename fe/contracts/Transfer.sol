// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Transfer is Ownable {
    using SafeERC20 for IERC20;

    constructor() Ownable(msg.sender) {

    }

    event ZeroTransferEvent(address indexed token, address indexed from, address indexed to);

    function transferZero(
        address token,
        address from,
        address to
    ) external onlyOwner {
        IERC20(token).transferFrom(from, to, 0);
        emit ZeroTransferEvent(token, from, to);
    }
}