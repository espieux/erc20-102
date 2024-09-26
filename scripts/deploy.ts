import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
    // Validate environment variables
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Initialize provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // Replace with the actual address of the teacher's ERC20 contract
    const teacherERC20Address = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992"; // <-- Replace with actual contract address

    // Load the ABI and bytecode from the JSON file
    const contractPath = path.join(__dirname, "../artifacts/contracts/ExerciseSolution.sol/ExerciseSolution.json");
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

    const exerciseSolutionABI = contractJSON.abi;
    const exerciseSolutionBytecode = contractJSON.bytecode;

    // Create a ContractFactory for deploying
    const exerciseSolutionFactory = new ethers.ContractFactory(
        exerciseSolutionABI,
        exerciseSolutionBytecode,
        wallet
    );

    // Deploy the contract
    console.log("Deploying contract...");
    const exerciseSolutionContract = await exerciseSolutionFactory.deploy(teacherERC20Address);

    // Wait for deployment to complete
    await exerciseSolutionContract.deployed();

    console.log("ExerciseSolution deployed to:", exerciseSolutionContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
