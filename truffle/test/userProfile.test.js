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

    describe("test username creation", function() {

        it("test read current user name", async function () {

            expect(await mainSystem.connect(seller).getUsernameByAddress(seller.address)
                .then(resultArray => {
                const name = resultArray[0];
                return name;
            })).be.undefined;
            
        });

        it("test for user name update", async function ()  {
            const addr = seller.address;
            await mainSystem.connect(seller).setUsername(addr, "allen");

            expect(await mainSystem.connect(seller).getUsernameByAddress(seller.address)
                .then(resultArray => {
                const name = resultArray;
                return name;
            })).to.equal("allen");
        });

        //it("test for user name update", async function ()  {
            //const addr = buyer.address;
            //await expect(mainSystem.connect(seller).setUsername(addr, "allen")).to.be.reverted;
        //});

    });

    describe("test find post by key", function() {

        beforeEach("deploy the contract instance and create purchase post and response message first", async function () {
            await mainSystem.connect(seller).createPurchasePost(10, 10);
            await mainSystem.connect(seller).createPurchasePost(20, 10);
            await mainSystem.connect(seller).createPurchasePost(10, 20);
            await mainSystem.connect(seller).createSellingPost(10, 10);
            await mainSystem.connect(seller).createSellingPost(20, 10);
            
        });

        it("test for address validation", async function ()  {
            const addr = buyer.address;
            await expect(mainSystem.connect(seller).getPurchasePostKeys(addr)).not.to.be.reverted;
        });

        it("test find purchase sell by key", async function () {

            expect(await mainSystem.connect(seller).getPurchasePostKeys(seller.address)).to.have.lengthOf(3);
            
        });

        it("test for address validation", async function ()  {
            const addr = buyer.address;
            await expect(mainSystem.connect(seller).getSellingPostKeys(addr)).not.to.be.reverted;
        });

        it("test find purchase post by key", async function () {

            expect(await mainSystem.connect(seller).getSellingPostKeys(seller.address)).to.have.lengthOf(2);
            
        });
    });

    describe("test to chcek elec units", function() {

        beforeEach("deploy the contract instance and create purchase post and response message first", async function () {
            await mainSystem.connect(buyer).createPurchasePost(10, 10);
            await mainSystem.connect(buyer).createPurchasePost(20, 10);
            await mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 10, 0);
            
        });

        it("test for input validation", async function ()  {

            await expect(mainSystem.connect(seller).getAvailableElecUnitsByAccountAddress(buyer.address)).not.to.be.reverted;
            await expect(mainSystem.connect(seller).getAvailableElecUnitsByAccountAddress(seller.address)).not.to.be.reverted;
            await expect(mainSystem.connect(seller).getAvailableElecUnitsByAccountAddress(other.address)).not.to.be.reverted;
        });

        it("test for defaut elec units for both buyer and seller", async function ()  {
            const resBuyer =  await mainSystem.connect(seller).getAvailableElecUnitsByAccountAddress(buyer.address);
            expect(await resBuyer.toNumber()).to.equal(0);
            const resSeller =  await mainSystem.connect(seller).getAvailableElecUnitsByAccountAddress(seller.address);
            expect(await resSeller.toNumber()).to.equal(100);

        });

        //TO DO returnallresponses
    });

});