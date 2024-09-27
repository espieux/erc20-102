import { ethers } from "ethers";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function approveExerciseSolution(): Promise<void> {
    // Ensure environment variables are loaded
    if (!process.env.ARB_SEPOLIA_URL || !process.env.PRIVATE_KEY) {
        throw new Error("Please set your .env variables (ARB_SEPOLIA_URL, PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.ARB_SEPOLIA_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // ERC20 token address and ExerciseSolution contract address
    const ERC20_ADDRESS: string = "0x5ADeBf74a71360Be295534274041ceeD6A39977a"; 
    const EXERCISE_SOLUTION_ADDRESS: string = "0x9B7b44ba3A46A7a28018ca4dC14647466382E4eF"; 
    // ERC20 ABI with only the approve function
    const ERC20_ABI: string[] = [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ];

    // Connect to ERC20 contract
    const erc20Contract: ethers.Contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, wallet);

    // Set amount to approve
    const amountToApprove: ethers.BigNumber = ethers.utils.parseUnits("0", 18);

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
