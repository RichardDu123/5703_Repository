const { expect } = require("chai");
const { ethers} = require("hardhat");

describe("payment process", function () {
    let buyer1, seller1, buyer2, seller2, mainSystem;
    //depoly MainSystem contract before each test
    beforeEach("deploy the contract instance first", async function () {
        const MainSystem = await ethers.getContractFactory("MainSystem");
        //get address infor for first three account for testing purpose
        [buyer1, seller1, buyer2, seller2] = await ethers.getSigners();
        mainSystem = await MainSystem.deploy();
        await mainSystem.deployed();
        await mainSystem.connect(buyer1).addAvailableElecUnits(seller1.address, 100);
        await mainSystem.connect(buyer1).addAvailableElecUnits(seller2.address, 100);

    });
    
    describe("payment for purchase post", function() {
        let paymentSystem;
        //creat selling post and response message before each test for payment
        beforeEach("pre process for the payment", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);                   
            await mainSystem.connect(buyer2).createPurchasePost(20, 15);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 10, 0);
            await mainSystem.connect(seller2).createResponseMessageToPurchasePost(10, 10, 0);  

            const responseMessagesbyKey = await mainSystem.returnPurchasePostResponseMessagesByKey(0).then(resultArray => {
            const responseMessagesbyKey = resultArray[0];
                return responseMessagesbyKey;
            });

            const PaymentSystem = await ethers.getContractFactory("PostResponseMessage");

            paymentSystem = await PaymentSystem.attach(responseMessagesbyKey);      
        });

        it("test amount", async function(){
            
            await paymentSystem.connect(buyer1).triggerPurchasePostPayment();
            const resBuyer1 =  await mainSystem.connect(buyer1).getAvailableElecUnitsByAccountAddress(buyer1.address);
            console.log(resBuyer1.toNumber());
            expect(await resBuyer1.toNumber()).to.equal(110);
            const resSeller1 =  await mainSystem.connect(buyer1).getAvailableElecUnitsByAccountAddress(seller1.address);
            console.log(resSeller1.toNumber());
            expect(await resSeller1.toNumber()).to.equal(90);

        });

    }); 
    
    describe("test for user new purchased elec unit to new sell post", function() {
        let paymentSystem;
        //creat selling post and response message before each test for payment
        beforeEach("pre process for the payment", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);                   
            await mainSystem.connect(buyer2).createPurchasePost(20, 10);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 10, 0);
            await mainSystem.connect(seller2).createResponseMessageToPurchasePost(20, 10, 0);  

            const responseMessagesbyKey = await mainSystem.returnPurchasePostResponseMessagesByKey(0).then(resultArray => {
            const responseMessagesbyKey = resultArray[0];
                return responseMessagesbyKey;
            });

            const PaymentSystem = await ethers.getContractFactory("PostResponseMessage");

            paymentSystem = await PaymentSystem.attach(responseMessagesbyKey);

            await paymentSystem.connect(buyer1).triggerPurchasePostPayment();  

                        
            await mainSystem.connect(seller1).createSellingPost(30, 20);
            await mainSystem.connect(buyer1).createResponseMessageToSellingPost(20, 15, 0);
            await mainSystem.connect(buyer2).createResponseMessageToSellingPost(10, 10, 0);

            const responseMessagesbyKey1 = await mainSystem.returnSellingPostResponseMessagesByKey(0).then(resultArray => {
            const responseMessagesbyKey1 = resultArray[0];
                return responseMessagesbyKey1;
            });

            const PaymentSystemNew = await ethers.getContractFactory("PostResponseMessage");

            paymentSystemNew = await PaymentSystemNew.attach(responseMessagesbyKey1);
 
        });

        it("test amount", async function(){
                    
            await paymentSystemNew.connect(buyer1).triggerSellingPostPayment();
            const resBuyer2 =  await mainSystem.connect(seller1).getAvailableElecUnitsByAccountAddress(buyer1.address);
            console.log(resBuyer2.toNumber());
            expect(await resBuyer2.toNumber()).to.equal(130);
            const resSeller2 =  await mainSystem.connect(seller1).getAvailableElecUnitsByAccountAddress(seller1.address);
            console.log(resSeller2.toNumber());
            expect(await resSeller2.toNumber()).to.equal(70);  

        });

    });

    

    describe("test for get recent average purchase price", function() {
        let paymentSystem;
        //creat selling post and response message before each test for payment
        beforeEach("pre process for the payment", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);                   
            await mainSystem.connect(buyer2).createPurchasePost(10, 15);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 10, 0);
            await mainSystem.connect(seller2).createResponseMessageToPurchasePost(20, 10, 0);  

            const responseMessagesbyKey = await mainSystem.returnPurchasePostResponseMessagesByKey(0).then(resultArray => {
            const responseMessagesbyKey = resultArray[0];
                return responseMessagesbyKey;
            });

            const PaymentSystem = await ethers.getContractFactory("PostResponseMessage");

            paymentSystem = await PaymentSystem.attach(responseMessagesbyKey);

            await paymentSystem.connect(buyer1).triggerPurchasePostPayment();  


            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 15, 1);
            await mainSystem.connect(seller2).createResponseMessageToPurchasePost(10, 20, 1);

            const responseMessagesbyKey1 = await mainSystem.returnPurchasePostResponseMessagesByKey(1).then(resultArray => {
            const responseMessagesbyKey1 = resultArray[0];
                return responseMessagesbyKey1;
            });

            const PaymentSystemNew = await ethers.getContractFactory("PostResponseMessage");

            paymentSystemNew = await PaymentSystemNew.attach(responseMessagesbyKey1);
 
        });

        it("test amount avg buy price", async function(){
                    
            await paymentSystemNew.connect(buyer2).triggerPurchasePostPayment();
            const resBuyer2 =  await mainSystem.connect(buyer2).getAvailableElecUnitsByAccountAddress(buyer2.address);
            console.log(resBuyer2.toNumber());
            expect(await resBuyer2.toNumber()).to.equal(10);
            const resSeller2 =  await mainSystem.connect(buyer2).getAvailableElecUnitsByAccountAddress(seller1.address);
            console.log(resSeller2.toNumber());
            expect(await resSeller2.toNumber()).to.equal(80);

            //update the avg price for recent trancation
            await mainSystem.connect(buyer2).updateAndReturnRecentAveragePriceforBuy();
            expect (await mainSystem.connect(buyer2).returnRecentAveragePriceforBuy()).to.equal('12.500');
        });

    });
       
  
    

});