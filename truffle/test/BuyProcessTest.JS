const { expect } = require("chai");
const { ethers} = require("hardhat");

describe("MainSystem", function () {
    let seller, buyer1, buyer2, mainSystem, ownerBalance;
    //depoly MainSystem contract before each test
    beforeEach("deploy the contract instance first", async function () {
        const MainSystem = await ethers.getContractFactory("MainSystem");
        //get address infor for first three account for testing purpose
        [seller, buyer1, buyer2] = await ethers.getSigners();
        //chcek user balance in eth
        ownerBalance = await ethers.provider.getBalance(seller.address);
        console.log(Number(ownerBalance));
        mainSystem = await MainSystem.deploy();
        await mainSystem.deployed();     
    });


   //test for ourchase post creation
    describe("test for create Purchase Post", function() {
        //test the value validation that enter from user, use revertedwith() check if it return correct error message
        it("test purchase post value validation", async function () {
            expect(
                mainSystem.createPurchasePost(0, 10)).to.be.revertedWith('purchase price must be greater than 0');

            expect(
                mainSystem.createPurchasePost(10, 0)).to.be.revertedWith('amount to buy must be greater than 0');
        });

        //Test the creation for multi users, in this case we create different purchase post by 2 different users
        it("test purchase post creation for multi users", async function () {                    
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            //check the buyer address is equal to poster address
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

        //test the purchase post counter, create two purchase post, and the counter should return 2
        it("test purchase post counter", async function () {          
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);                   
            await mainSystem.connect(buyer2).createPurchasePost(20, 10);
            expect(await mainSystem.purchasePostCounter()).to.equal(2);
  
        });


    });

    describe("test for create Response Message To Purchase Post", function() {

         //creat purschase post before each test for response message
        beforeEach("deploy the contract instance first", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            await mainSystem.connect(buyer1).createPurchasePost(20, 10);
        });


        it("test response Message users valiadtion", async function () {
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

    });
   

});