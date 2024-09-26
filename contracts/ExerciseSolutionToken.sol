// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC20Mintable.sol";

// A mintable ERC20 token that tracks deposits
contract ExerciseSolutionToken is ERC20, Ownable, IERC20Mintable {
    // Mapping to track minters
    mapping(address => bool) private minters;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // Function to set an address as a minter
    function setMinter(address minterAddress, bool isMinter) external override onlyOwner {
        minters[minterAddress] = isMinter;
    }

    // Function to check if an address is a minter
    function isMinter(address minterAddress) external view override returns (bool) {
        return minters[minterAddress];
    }

    // Mint function, restricted to authorized minters
    function mint(address to, uint256 amount) external override {
        require(minters[msg.sender], "Caller is not a minter");
        _mint(to, amount);
    }

    // Burn function restricted to authorized minters
    function burn(address from, uint256 amount) external {
        require(minters[msg.sender], "Caller is not a minter");
        _burn(from, amount);
    }
}
