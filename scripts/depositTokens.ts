import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const exerciseSolutionABI = require('../artifacts/contracts/ExerciseSolution.sol/ExerciseSolution.json').abi;
const teacherERC20ABI = require('../artifacts/contracts/ERC20Claimable.sol/ERC20Claimable.json').abi;

async function main() {
    // Ensure environment variables are loaded
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // Contract addresses
    const exerciseSolutionAddress = "0x1455bD34d7e087d17742ba7CA218A7d247A5290e";
    const teacherERC20Address = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992";
    
    // Initialize contracts
    const exerciseSolution = new ethers.Contract(exerciseSolutionAddress, exerciseSolutionABI, wallet);
    const teacherERC20 = new ethers.Contract(teacherERC20Address, teacherERC20ABI, wallet);

    // Amount to deposit (make sure it matches the successful Etherscan call)
    const amountToDeposit = ethers.utils.parseUnits("0.1000025", 18); // Adjust according to your token's decimals

    // Approve ExerciseSolution to spend the tokens
    console.log("Approving transfer...");
    const approveTx = await teacherERC20.approve(exerciseSolutionAddress, amountToDeposit);
    await approveTx.wait();
    console.log("Approved!");

    // Call depositTokens
    console.log("Depositing tokens...");
    const depositTx = await exerciseSolution.depositTokens(amountToDeposit, {
        gasLimit: ethers.utils.hexlify(500000), // Adjust the gas limit as necessary
    });
    const receipt = await depositTx.wait();
    console.log(`Deposit TX hash: ${receipt.transactionHash}`);
}

main().catch(console.error);
