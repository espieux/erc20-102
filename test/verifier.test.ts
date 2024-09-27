import { BigNumberish } from "ethers";
import { ethers } from "hardhat";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { expect } = require("chai");

describe("exo7-verifier", function () {
  it("Verify exo 7 completion", async function () {
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

    // Deploy ExerciseSolutionToken
    console.log("Deploying ExerciseSolutionToken...");
    const exerciseSolutionTokenFactory = await ethers.getContractFactory("ExerciseSolutionToken");
    const exerciseSolutionTokenContract = await exerciseSolutionTokenFactory.deploy("SolutionToken", "SLT");
    await exerciseSolutionTokenContract.waitForDeployment();
    console.log(`ExerciseSolutionToken deployed to: ${(exerciseSolutionTokenContract as any).target}`);

    // Deploy ExerciseSolution
    console.log("Deploying ExerciseSolution...");
    const exerciseSolutionFactory = await ethers.getContractFactory("ExerciseSolution");
    const exerciseSolutionContract = await exerciseSolutionFactory.deploy((claimableToken as any).target, (exerciseSolutionTokenContract as any).target);
    await exerciseSolutionContract.waitForDeployment();
    console.log(`ExerciseSolution deployed to: ${(exerciseSolutionContract as any).target}`);

    // Grant minting rights to ExerciseSolution contract
    console.log("Granting minting rights to ExerciseSolution...");
    await exerciseSolutionTokenContract.setMinter((exerciseSolutionContract as any).target, true);

    // Check if the address is a minter (for debugging)
    const hasMinterRights = await exerciseSolutionTokenContract.isMinter((exerciseSolutionContract as any).target);
    console.log(`ExerciseSolution has minter rights: ${hasMinterRights}`);

    // Submit the exercise to the evaluator
    await evaluator.submitExercise((exerciseSolutionContract as any).target);
    console.log("Exercise submitted!");

    // Call the function and get the transaction response
    const tx = await evaluator.ex7_createERC20();
    const receipt = await tx.wait();

    // Verify that the transaction was successful
    expect(receipt.status).to.equal(1); // 1 indicates success
  });
});
