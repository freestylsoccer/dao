// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.5;

import "../interfaces/IERC20DAO.sol";
import "../types/Ownable.sol";

contract OhmFaucet is Ownable {
    IERC20DAO public ohm;

    constructor(address _ohm) {
        ohm = IERC20DAO(_ohm);
    }

    function setOhm(address _ohm) external onlyOwner {
        ohm = IERC20DAO(_ohm);
    }

    function dispense() external {
        ohm.transfer(msg.sender, 1e9);
    }
}
