const { expect } = require("chai");
const { ethers} = require("hardhat");

describe("MainSystem", function () {
    let seller1, buyer, seller2, mainSystem;
    //depoly MainSystem contract before each test
    beforeEach("deploy the contract instance first", async function () {
        const MainSystem = await ethers.getContractFactory("MainSystem");
        //get address infor for first three account for testing purpose
        [buyer, seller1, seller2] = await ethers.getSigners();
        mainSystem = await MainSystem.deploy();
        await mainSystem.deployed();     
    });

});