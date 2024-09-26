// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Claimable.sol";
import "./IExerciseSolution.sol";

contract ExerciseSolution is IExerciseSolution {
    // State variables
    ERC20Claimable public teacherERC20;
    mapping(address => uint256) public userTokensInCustody;

    // Constructor to initialize the address of the teacher's ERC20 contract
    constructor(address _teacherERC20) {
        teacherERC20 = ERC20Claimable(_teacherERC20);
    }

    // Claim tokens on behalf of the user
    function claimTokensOnBehalf() external override {
        uint256 amountClaimed = teacherERC20.claimTokens();
        
        // Track the amount claimed by the user
        userTokensInCustody[msg.sender] += amountClaimed;
    }

    // Get the number of tokens in custody for a specific address
    function tokensInCustody(address callerAddress) external view override returns (uint256) {
        return userTokensInCustody[callerAddress];
    }

    // Withdraw tokens from the contract to the address that initially claimed them
    function withdrawTokens(uint256 amountToWithdraw) external override returns (uint256) {
        require(userTokensInCustody[msg.sender] >= amountToWithdraw, "Not enough tokens in custody");

        // Update the tokens in custody for the caller
        userTokensInCustody[msg.sender] -= amountToWithdraw;

        // Transfer tokens to the caller
        require(teacherERC20.transfer(msg.sender, amountToWithdraw), "Transfer failed");

        return amountToWithdraw;
    }

    // Deposit tokens back into the contract
    function depositTokens(uint256 amountToDeposit) external override returns (uint256) {
        require(teacherERC20.transferFrom(msg.sender, address(this), amountToDeposit), "Transfer failed");
        userTokensInCustody[msg.sender] += amountToDeposit;

        return amountToDeposit;
    }

    // Return the address of the teacher's ERC20 token contract
    function getERC20DepositAddress() external view override returns (address) {
        return address(teacherERC20);
    }
}