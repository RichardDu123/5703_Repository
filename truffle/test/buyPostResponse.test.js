const { expect } = require("chai");
const { ethers} = require("hardhat");
// need npm install --save-dev @nomicfoundation/hardhat-chai-matchers to make revertedWith works
//const { ethers} = require("@nomicfoundation/hardhat-chai-matchers");

describe("purchaseProcess", function () {
    let seller, buyer1, buyer2, mainSystem;
    //depoly MainSystem contract before each test
    beforeEach("deploy the contract instance first", async function () {
        const MainSystem = await ethers.getContractFactory("MainSystem");
        //get address infor for first three account for testing purpose
        [buyer1, seller, buyer2] = await ethers.getSigners();
        mainSystem = await MainSystem.deploy();
        await mainSystem.deployed();     
    });


   //test for ourchase post creation
    describe("test for create Purchase Post", function() {
        //test the value validation that enter from user, use revertedwith() check if it return correct error message
        it("test purchase post value validation", async function () {
            await expect(
                mainSystem.connect(buyer1).createPurchasePost(0, 10)).to.be.revertedWith('purchase price must be greater than 0');

            await expect(
                mainSystem.connect(buyer1).createPurchasePost(10, 0)).to.be.revertedWith('amount to buy must be greater than 0');
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
            await mainSystem.connect(buyer1).createPurchasePost(20, 10);
            expect(await mainSystem.connect(buyer1).returnPurchasePostMapSize()).to.equal(2);
  
        });


    });

    describe("test for create Response Message To Purchase Post", function() {

         //creat purschase post before each test for response message
        beforeEach("deploy the contract instance and creat purchase post first", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            await mainSystem.connect(buyer1).createPurchasePost(20, 10);
        });

        //test user validation for the response message, the poster and responser should be different
        it("test response Message users valiadtion", async function () {
            expect(
                mainSystem.connect(buyer1).createResponseMessageToPurchasePost(10, 10, 0))
                .to.be.revertedWith("You cannot reply to your own purchase post");
            
        });

        //test the value validation that enter from user, use revertedwith() check if it return correct error message
        it("test response Message data valiadtion", async function () {
            await expect(
                mainSystem.connect(seller).createResponseMessageToPurchasePost(0, 10, 0))
                .to.be.revertedWith("amount must be greater than 0");
            await expect(
                mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 0, 0))
                .to.be.revertedWith("quotation must be greater than 0");
            
            await expect(
                mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 10, -1))
                .to.be.revertedWith("post key starts from 0");
            
        });

        //test the functionality for getPurchasePostByKey, if success the result shold be same as the 6th atttributes that store in the purchase post
        it("test for get response Message by key", async function () {
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

    describe("test for payment process Purchase Post", function() {

         //creat purschase post and response message before each test for payment
        beforeEach("deploy the contract instance and create purchase post and response message first", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            await mainSystem.connect(buyer2).createPurchasePost(20, 10);
            await mainSystem.connect(buyer1).createPurchasePost(10, 20);
            await mainSystem.connect(seller).createResponseMessageToPurchasePost(10, 10, 0);
            
        });

        it("test return All Purchase Posts By Address ", async function(){
            const allPost = await mainSystem.connect(seller).returnAllPurchasePostsByAddress(buyer1.address);
            expect(allPost).to.have.lengthOf(2);
        });

        it("test banlance", async function () {
           //chcek user balance in eth, will use for payment chcek
            const ownerBalance = await ethers.provider.getBalance(seller.address);
            console.log(ethers.utils.formatEther(ownerBalance));          
        });


    });
   

});