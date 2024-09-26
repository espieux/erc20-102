// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IERC20Mintable.sol";
import "./ExerciseSolutionToken.sol"; // Import the concrete implementation of your token
import "./IExerciseSolution.sol";
import "./ERC20Claimable.sol"; // Import the ERC20Claimable contract or interface

contract ExerciseSolution is IExerciseSolution {
    // State variables
    ERC20Claimable public teacherERC20;
    IERC20Mintable public depositToken;
    mapping(address => uint256) public userTokensInCustody; // Track tokens in custody per user

    // Constructor to initialize the address of the teacher's ERC20 contract and deposit token
    constructor(address _teacherERC20, address _depositToken) {
        teacherERC20 = ERC20Claimable(_teacherERC20);
        depositToken = IERC20Mintable(_depositToken);
    }

    // Claim tokens on behalf of the user
    function claimTokensOnBehalf() external override {
        uint256 amountClaimed = teacherERC20.claimTokens();
        
        // Track the amount claimed by the user
        userTokensInCustody[msg.sender] += amountClaimed;
        
        // Mint equivalent deposit tokens
        depositToken.mint(msg.sender, amountClaimed);
    }

    // Deposit tokens into the contract
    function depositTokens(uint256 amountToDeposit) external override returns (uint256) {
        // Transfer tokens from the user to this contract
        require(teacherERC20.transferFrom(msg.sender, address(this), amountToDeposit), "Transfer failed");

        // Track the deposited amount in custody
        userTokensInCustody[msg.sender] += amountToDeposit;

        // Mint corresponding deposit tokens to the user
        depositToken.mint(msg.sender, amountToDeposit);

        return amountToDeposit;
    }

    // Withdraw tokens from the contract to the address that initially claimed them
    function withdrawTokens(uint256 amountToWithdraw) external override returns (uint256) {
        require(userTokensInCustody[msg.sender] >= amountToWithdraw, "Not enough tokens in custody");

        // Transfer the deposit tokens from the user to this contract
        require(depositToken.transferFrom(msg.sender, address(this), amountToWithdraw), "Transfer of deposit tokens failed");

        // Cast depositToken to ExerciseSolutionToken to access the burn function
        ExerciseSolutionToken(address(depositToken)).burn(address(this), amountToWithdraw);

        // Update the tokens in custody for the caller
        userTokensInCustody[msg.sender] -= amountToWithdraw;

        // Transfer the equivalent `teacherERC20` tokens to the user
        require(teacherERC20.transfer(msg.sender, amountToWithdraw), "Transfer of teacher tokens failed");

        return amountToWithdraw;
    }

    // Return the number of tokens in custody for a specific address
    function tokensInCustody(address callerAddress) external view override returns (uint256) {
        return userTokensInCustody[callerAddress];
    }

    // Return the address of the teacher's ERC20 token contract
    function getERC20DepositAddress() external view override returns (address) {
        return address(teacherERC20);
    }
}
