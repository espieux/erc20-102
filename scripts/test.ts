import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Load ABI for IERC20Mintable interface
const ierc20MintableABI = require('../artifacts/contracts/IERC20Mintable.sol/IERC20Mintable.json').abi;

async function main() {
    // Ensure environment variables are loaded
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Set up provider and wallet
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet: ethers.Wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // Contract address for the ERC20 token (exerciseSolutionERC20)
    const exerciseSolutionERC20Address = "0x857C126398668B1D602c93776DaDfe37dEa2fd44"; // Replace with actual address

    // Initialize contract using the IERC20Mintable ABI
    const exerciseSolutionERC20Contract = new ethers.Contract(exerciseSolutionERC20Address, ierc20MintableABI, wallet);

    try {
        console.log("Interacting with IERC20Mintable contract at:", exerciseSolutionERC20Address);

        // Get the total supply of the token
        const totalSupply = await exerciseSolutionERC20Contract.totalSupply();
        console.log("Total Supply:", ethers.utils.formatUnits(totalSupply, 18));

        // Check if the wallet address is a minter
        const isMinter = await exerciseSolutionERC20Contract.isMinter(wallet.address);
        console.log(`Is wallet address a minter?: ${isMinter.toString()}`);
    } catch (error) {
        console.error("Error interacting with the IERC20Mintable contract:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error executing script:", error);
        process.exit(1);
    });
