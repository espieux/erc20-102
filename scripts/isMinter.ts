import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Load ABI for the ExerciseSolutionToken contract
const exerciseSolutionTokenABI = require('../artifacts/contracts/ExerciseSolutionToken.sol/ExerciseSolutionToken.json').abi;

async function main() {
    // Ensure environment variables are loaded
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // Contract addresses
    const exerciseSolutionTokenAddress = "0x857C126398668B1D602c93776DaDfe37dEa2fd44"; // Replace with actual address
    const exerciseSolutionAddress = "0x2B049F415f4AE8F8457Cd3C3777028167D1292f8"; // Replace with actual address

    // Initialize ExerciseSolutionToken contract
    const exerciseSolutionTokenContract = new ethers.Contract(exerciseSolutionTokenAddress, exerciseSolutionTokenABI, wallet);

    try {
        // Call isMinter to check if ExerciseSolution is a minter
        console.log(`Checking if ${exerciseSolutionAddress} is a minter...`);
        const isMinter = await exerciseSolutionTokenContract.isMinter(exerciseSolutionAddress);
        
        if (isMinter) {
            console.log(`${exerciseSolutionAddress} is a minter of ${exerciseSolutionTokenAddress}`);
        } else {
            console.log(`${exerciseSolutionAddress} is NOT a minter of ${exerciseSolutionTokenAddress}`);
        }
    } catch (error) {
        console.error("Error checking minter status:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error executing script:", error);
        process.exit(1);
    });
