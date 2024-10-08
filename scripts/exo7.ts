import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Load ABI for the Evaluator contract
const evaluatorABI = require('../artifacts/contracts/Evaluator.sol/Evaluator.json').abi;

async function main() {
    // Ensure environment variables are loaded
    if (!process.env.ARB_SEPOLIA_URL || !process.env.PRIVATE_KEY) {
        throw new Error("Please set your .env variables (ARB_SEPOLIA_URL, PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.ARB_SEPOLIA_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Evaluator contract address
    const evaluatorContractAddress = "0xD05c425C843c327c90D2Db98Aba9B715BAA51736"; // Replace with actual address

    // Initialize evaluator contract
    const evaluatorContract = new ethers.Contract(evaluatorContractAddress, evaluatorABI, wallet);

    try {
        // Call ex7_createERC20 function
        console.log("Calling ex7_createERC20...");
        const tx = await evaluatorContract.ex7_createERC20({
            gasLimit: ethers.utils.hexlify(500000) // Adjust gas limit as necessary
        });

        console.log(`Transaction sent: ${tx.hash}`);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log(`Transaction mined! Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Error calling ex7_createERC20:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error executing script:", error);
        process.exit(1);
    });
