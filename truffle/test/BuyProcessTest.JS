const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MainSystem", function () {
    let seller, buyer1, buyer2, mainSystem;

        beforeEach("deploy the contract instance first", async function () {
            const MainSystem = await ethers.getContractFactory("MainSystem");
            [seller, buyer1, buyer2] = await ethers.getSigners();
            mainSystem = await MainSystem.deploy();
            await mainSystem.deployed();
        });
   
    describe("test for create Purchase Post", function() {
        
        it("test purchase post value validation", async function () {
            expect(
                mainSystem.createPurchasePost(0, 10)).to.be.revertedWith('purchase price must be greater than 0');

            expect(
                mainSystem.createPurchasePost(10, 0)).to.be.revertedWith('amount to buy must be greater than 0');
        });

        it("test purchase post creation for multi users", async function () {                    
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            expect(await mainSystem.getPurchasePostByKey(0).then(resultArray => {
                const buyer = resultArray[2];
                return buyer;
            })).to.equal(buyer1.address);
            
            await mainSystem.connect(buyer2).createPurchasePost(20, 10);
            expect(await mainSystem.getPurchasePostByKey(1).then(resultArray => {
                const buyer = resultArray[2];
                return buyer;
            })).to.equal(buyer2.address);
  
        });

        it("test purchase post counter", async function () {          
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);                   
            await mainSystem.connect(buyer2).createPurchasePost(20, 10);
            expect(await mainSystem.purchasePostCounter()).to.equal(2);
  
        });


    });

    describe("test for create Response Message To Purchase Post", function() {

        it("test response Message users valiadtion", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            expect(
                mainSystem.connect(buyer1).createResponseMessageToPurchasePost(10, 10, 0))
                .to.be.revertedWith("You cannot reply to your own purchase post");
            
            await mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 10, 0);
            const responseMessagesbyKey = await mainSystem.connect(seller).returnPurchasePostResponseMessagesByKey(0).then(resultArray => {
                const responseMessagesbyKey = resultArray[0];
                return responseMessagesbyKey;
            });

            expect(await mainSystem.getPurchasePostByKey(0).then(resultArray => {
                const responseMessages = resultArray[5];
                return responseMessages[0];
            })).to.equal(responseMessagesbyKey);
        });

        it("test response Message users valiadtion", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            expect(
                mainSystem.connect(buyer1).createResponseMessageToPurchasePost(0, 10, 0))
                .to.be.revertedWith("amount must be greater than 0");
            expect(
                mainSystem.connect(buyer1).createResponseMessageToPurchasePost(10, 0, 0))
                .to.be.revertedWith("quotation must be greater than 0");
            
            expect(
                mainSystem.connect(buyer1).createResponseMessageToPurchasePost(0, 10, 0))
                .to.be.revertedWith("post key starts from 0");
            
        });

    });
    

});