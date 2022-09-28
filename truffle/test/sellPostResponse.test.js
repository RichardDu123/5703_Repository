const { expect } = require("chai");
const { ethers} = require("hardhat");
// need npm install --save-dev @nomicfoundation/hardhat-chai-matchers to make revertedWith works
//const { ethers} = require("@nomicfoundation/hardhat-chai-matchers");

describe("sell Process", function () {
    let buyer, seller1, seller2, mainSystem;
    //depoly MainSystem contract before each test
    beforeEach("deploy the contract instance first", async function () {
        const MainSystem = await ethers.getContractFactory("MainSystem");
        //get address infor for first three account for testing purpose
        [buyer, seller1, seller2] = await ethers.getSigners();
        mainSystem = await MainSystem.deploy();
        await mainSystem.deployed();     
    });


   //test for selling post creation
    describe("test for create selling Post", function() {
        //test the value validation that enter from user, use revertedwith() check if it return correct error message
        it("test selling post value validation", async function () {
            await expect(
                mainSystem.connect(seller1).createSellingPost(0, 10)).to.be.revertedWith('selling price must be greater than 0');

            await expect(
                mainSystem.connect(seller1).createSellingPost(10, 0)).to.be.revertedWith('amount to buy must be greater than 0');
        });

        //Test the creation for multi users, in this case we create different selling post by 2 different users
        it("test selling post creation for multi users", async function () {                    
            await mainSystem.connect(seller1).createSellingPost(10, 10);
            //check the buyer address is equal to poster address
            expect(await mainSystem.getSellingPostByKey(0).then(resultArray => {
                const seller1 = resultArray[2];
                return seller1;
            })).to.equal(seller1.address);
            
            await mainSystem.connect(seller2).createSellingPost(20, 10);
            expect(await mainSystem.getSellingPostByKey(1).then(resultArray => {
                const seller2 = resultArray[2];
                return seller2;
            })).to.equal(seller2.address);
  
        });

        //test the sell post counter, create two sell post, and the counter should return 2
        it("test purchase sell counter", async function () {          
            await mainSystem.connect(seller1).createSellingPost(10, 10);                   
            await mainSystem.connect(seller1).createSellingPost(20, 10);
            expect(await mainSystem.returnSellPostMapSize()).to.equal(2);
  
        });


    });

    describe("test for create Response Message To selling Post", function() {

         //creat selling post before each test for response message
        beforeEach("deploy the contract instance and creat selling post first", async function () {
            await mainSystem.connect(seller1).createSellingPost(10, 10);
            await mainSystem.connect(seller2).createSellingPost(20, 10);
        });

        //test user validation for the response message, the poster and responser should be different
        it("test response Message users valiadtion", async function () {
            await expect(
                mainSystem.connect(seller1).createResponseMessageToSellingPost(10, 10, 0))
                .to.be.revertedWith("You cannot reply to your own selling post");
            
        });

        //test the value validation that enter from user, use revertedwith() check if it return correct error message
        it("test response Message data valiadtion", async function () {
            await mainSystem.connect(seller1).createSellingPost(10, 10);
            await expect(
                mainSystem.connect(buyer).createResponseMessageToSellingPost(0, 10, 0))
                .to.be.revertedWith("amount must be greater than 0");
            await expect(
                mainSystem.connect(buyer).createResponseMessageToSellingPost(10, 0, 0))
                .to.be.revertedWith("quotation must be greater than 0");
            
            await expect(
                mainSystem.connect(buyer).createResponseMessageToSellingPost(0, 10, 0))
                .to.be.revertedWith("selling key starts from 0");
            
        });

        //test the functionality for getSellingPostByKey, if success the result shold be same as the 6th atttributes that store in the selling post
        it("test for get response Message by key", async function () {
           
            await mainSystem.connect(buyer).createResponseMessageToSellingPost(10, 10, 0);
            const responseMessagesbyKey = await mainSystem.connect(buyer).returnSellingPostResponseMessagesByKey(0).then(resultArray => {
                const responseMessagesbyKey = resultArray[0];
                return responseMessagesbyKey;
            });

            expect(await mainSystem.getSellingPostByKey(0).then(resultArray => {
                const responseMessages = resultArray[5];
                return responseMessages[0];
            })).to.equal(responseMessagesbyKey);
        });

    });

    describe("test for create Response Message To Selling Post", function() {

         //creat selling post and response message before each test for payment
        beforeEach("deploy the contract instance and create selling post and response message first", async function () {
            await mainSystem.connect(seller1).createSellingPost(10, 10);
            await mainSystem.connect(seller2).createSellingPost(20, 10);
            await mainSystem.connect(seller1).createSellingPost(10, 20);
            await mainSystem.connect(buyer).createResponseMessageToSellingPost(10, 10, 0);
            
        });

        it("test return All Purchase Posts By Address ", async function(){
            const allPost = await mainSystem.connect(buyer).returnAllSellingPostsByAddress(seller1.address);
            expect(allPost).to.have.lengthOf(2);
        });

        it("test banlance", async function () {
           //chcek user balance in eth, will use for payment chcek
            const ownerBalance = await ethers.provider.getBalance(buyer.address);
            console.log(ethers.utils.formatEther(ownerBalance));          
        });


    });
   

});