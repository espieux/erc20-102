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

    // Contract address
    const exerciseSolutionTokenAddress = "0x857C126398668B1D602c93776DaDfe37dEa2fd44"; // Replace with actual address

    // Initialize ExerciseSolutionToken contract
    const exerciseSolutionTokenContract = new ethers.Contract(exerciseSolutionTokenAddress, exerciseSolutionTokenABI, wallet);

    // Address to which you want to try minting tokens
    const evaluatorAddress = wallet.address;

    try {
        console.log(`Attempting to mint tokens as ${evaluatorAddress}...`);
        
        // Try minting 10000 tokens to the evaluator address
        const mintTx = await exerciseSolutionTokenContract.mint(evaluatorAddress, ethers.utils.parseUnits("10000", 18), {
            gasLimit: ethers.utils.hexlify(100000), // Adjust gas limit as necessary
        });

        // Wait for transaction receipt
        await mintTx.wait();
        console.log("Minting was successful. Evaluator was able to mint tokens.");
    } catch (error) {
        // If there's an error, it means minting was not successful (likely reverted)
        console.error("Minting failed as expected:", error);
        console.log("Evaluator was NOT able to mint tokens.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error executing script:", error);
        process.exit(1);
    });
