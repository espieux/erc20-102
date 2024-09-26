import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const exerciseSolutionABI = require('../artifacts/contracts/ExerciseSolution.sol/ExerciseSolution.json').abi;
const depositTokenABI = require('../artifacts/contracts/ExerciseSolutionToken.sol/ExerciseSolutionToken.json').abi;

async function main() {
    // Ensure environment variables are loaded
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // Contract addresses
    const exerciseSolutionAddress = "0x1455bD34d7e087d17742ba7CA218A7d247A5290e"; // Replace with your deployed ExerciseSolution contract address
    const depositTokenAddress = "0x140A07834C61971d4eC24861c8B4eB0c142c95aa"; // Replace with your deployed ExerciseSolutionToken contract address
    
    // Initialize contracts
    const exerciseSolution = new ethers.Contract(exerciseSolutionAddress, exerciseSolutionABI, wallet);
    const depositToken = new ethers.Contract(depositTokenAddress, depositTokenABI, wallet);

    // Amount to withdraw (adjust to the correct amount that was deposited)
    const amountToWithdraw = ethers.utils.parseUnits("0.1000025", 18); // Adjust according to your token's decimals

    // Approve ExerciseSolution to transfer your deposit tokens
    console.log("Approving transfer of deposit tokens...");
    const approveTx = await depositToken.approve(exerciseSolutionAddress, amountToWithdraw);
    await approveTx.wait();
    console.log("Approved!");

    // Call withdrawTokens
    console.log("Withdrawing tokens...");
    const withdrawTx = await exerciseSolution.withdrawTokens(amountToWithdraw, {
        gasLimit: ethers.utils.hexlify(500000), // Adjust the gas limit as necessary
    });
    const receipt = await withdrawTx.wait();
    console.log(`Withdraw TX hash: ${receipt.transactionHash}`);
}

main().catch(console.error);
