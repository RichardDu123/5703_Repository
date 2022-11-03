const { expect } = require("chai");
const { ethers } = require("hardhat");

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

            expect(await resSeller.toNumber()).to.equal(0);

        });

    });

    describe("test return all responses", function() {

        beforeEach("deploy the contract instance and create purchase post and response message first", async function () {
            await mainSystem.connect(buyer).createPurchasePost(10, 10);
            await mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 10, 0);
            await mainSystem.connect(other).createResponseMessageToPurchasePost(10, 10, 0);
            await mainSystem.connect(buyer).createPurchasePost(20, 10);
            await mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 10, 1);
            
        });

        it("test for return all responses for seller", async function ()  {

            const buyerResponse = await mainSystem.connect(buyer).returnAllResponses(buyer.address);
            expect(buyerResponse).to.have.lengthOf(0);

            const sellerResponse = await mainSystem.connect(buyer).returnAllResponses(seller.address);
            expect(sellerResponse).to.have.lengthOf(2);

            const otherResponse = await mainSystem.connect(buyer).returnAllResponses(other.address);
             expect(otherResponse).to.have.lengthOf(1);

        });



    }); 

    describe("test for add elec unit", function() {

        it("test for admin add elec to himself/herself", async function ()  {

            await expect(mainSystem.connect(buyer).addAvailableElecUnits(buyer.address, 100)).not.to.be.reverted;
            const resBuyer =  await mainSystem.connect(buyer).getAvailableElecUnitsByAccountAddress(buyer.address);
            expect(await resBuyer.toNumber()).to.equal(100);

        });

        it("test for admin add elec to others", async function ()  {

            await expect(mainSystem.connect(buyer).addAvailableElecUnits(seller.address, 50)).not.to.be.reverted;
            const resSeller =  await mainSystem.connect(buyer).getAvailableElecUnitsByAccountAddress(seller.address);
            expect(await resSeller.toNumber()).to.equal(50);

            await expect(mainSystem.connect(buyer).addAvailableElecUnits(other.address, 10)).not.to.be.reverted;
            const resOther =  await mainSystem.connect(buyer).getAvailableElecUnitsByAccountAddress(other.address);
            expect(await resOther.toNumber()).to.equal(10);

        });

         it("test for others add elec", async function ()  {

            await expect(mainSystem.connect(seller).addAvailableElecUnits(seller.address, 100)).to.be.reverted;
            const resSeller =  await mainSystem.connect(seller).getAvailableElecUnitsByAccountAddress(seller.address);
            expect(await resSeller.toNumber()).to.equal(0);

            await expect(mainSystem.connect(other).addAvailableElecUnits(seller.address, 100)).to.be.reverted;
            const resOther =  await mainSystem.connect(other).getAvailableElecUnitsByAccountAddress(seller.address);
            expect(await resOther.toNumber()).to.equal(0);

        });



    });

});