import { ethers } from "hardhat";

async function main() {
    // Deploying ERC20 TD Token
    console.log("Deploying ERC20 TD Token");
    const ERC20TD = await ethers.getContractFactory("ERC20TD");
    const tdToken = await ERC20TD.deploy("TD-ERC20-101", "TD-ERC20-101", BigInt("0x108b2a2c28029094000000"));

    await tdToken.waitForDeployment();

    // Deploying ERC20 Claimable Token
    console.log("Deploying Claimable Token");
    const ERC20Claimable = await ethers.getContractFactory("ERC20Claimable");
    const claimableToken = await ERC20Claimable.deploy("ClaimableToken", "CLTK", BigInt("0x108b2a2c28029094000000"));

    await claimableToken.waitForDeployment();

    // Deploying Evaluator Contract
    console.log("Deploying Evaluator");
    const Evaluator = await ethers.getContractFactory("Evaluator");
    const evaluator = await Evaluator.deploy((tdToken as any).target, (claimableToken as any).target);

    await evaluator.waitForDeployment();

    // Setting Permissions for the Evaluator
    console.log("Setting Permissions for Evaluator");
    await tdToken.setTeacher((evaluator as any).target, true);

    // Deploy Recap (Log the deployed contract addresses)
    console.log("Deployment Recap:");
    console.log(`TDToken deployed at: ${(tdToken as any).target}`);
    console.log(`ClaimableToken deployed at: ${(claimableToken as any).target}`);
    console.log(`Evaluator deployed at: ${(evaluator as any).target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});