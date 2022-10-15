const { expect } = require("chai");
const { ethers} = require("hardhat");

// need npm install --save-dev @nomicfoundation/hardhat-chai-matchers to make revertedWith works
//const { ethers} = require("@nomicfoundation/hardhat-chai-matchers");

describe("User Functionalities", function () {
    let seller, buyer, other, mainSystem;
    //depoly MainSystem contract before each test
    beforeEach("deploy the contract instance first", async function () {
        const MainSystem = await ethers.getContractFactory("MainSystem");
        //get address infor for first three account for testing purpose
        [buyer, seller, other] = await ethers.getSigners();
        mainSystem = await MainSystem.deploy();
        await mainSystem.deployed();     
    });

});