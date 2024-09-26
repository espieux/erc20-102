import { ethers } from "ethers";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function approveExerciseSolution(): Promise<void> {
    // Ensure environment variables are loaded
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // ERC20 token address and ExerciseSolution contract address
    const ERC20_ADDRESS: string = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992"; 
    const EXERCISE_SOLUTION_ADDRESS: string = "0x1455bD34d7e087d17742ba7CA218A7d247A5290e"; 
    // ERC20 ABI with only the approve function
    const ERC20_ABI: string[] = [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ];

    // Connect to ERC20 contract
    const erc20Contract: ethers.Contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, wallet);

    // Set amount to approve
    const amountToApprove: ethers.BigNumber = ethers.utils.parseUnits("0.100002500002300000", 18);

    // Approve ExerciseSolution contract to spend tokens
    try {
        const tx: ethers.ContractTransaction = await erc20Contract.approve(EXERCISE_SOLUTION_ADDRESS, amountToApprove);
        console.log(`Transaction hash: ${tx.hash}`);
        await tx.wait();
        console.log(`Approved ${amountToApprove.toString()} tokens for ExerciseSolution to spend.`);
    } catch (error) {
        console.error("Error approving tokens:", error);
    }
}

approveExerciseSolution()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
