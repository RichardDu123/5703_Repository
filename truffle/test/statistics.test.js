    const { expect } = require("chai");
    const { ethers} = require("hardhat");
    
    describe("statistics Functionalities", function () {
    
        let buyer1, seller1, buyer2, seller2, mainSystem;
        let paymentSystem, paymentSystemOne, paymentSystemTwo, paymentSystemThree, paymentSystemFour, paymentSystemFive, paymentSystemSix, paymentSystemSeven, paymentSystemEight, paymentSystemNine;
        //creat selling post and response message before each test for payment
        beforeEach("pre process for the payment", async function () {
            const MainSystem = await ethers.getContractFactory("MainSystem");
            //get address infor for first three account for testing purpose
            [buyer1, seller1, buyer2, seller2] = await ethers.getSigners();
            mainSystem = await MainSystem.deploy();
            await mainSystem.deployed();
            await mainSystem.connect(buyer1).addAvailableElecUnits(seller1.address, 100);
            await mainSystem.connect(buyer1).addAvailableElecUnits(seller2.address, 100);
            await mainSystem.connect(buyer1).addAvailableElecUnits(buyer2.address, 100);
    
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
    
            //trancaction 1
            await paymentSystem.connect(buyer1).triggerPurchasePostPayment();  
    
    
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 15, 1);
            await mainSystem.connect(seller2).createResponseMessageToPurchasePost(10, 20, 1);
    
            const responseMessagesbyKey1 = await mainSystem.returnPurchasePostResponseMessagesByKey(1).then(resultArray => {
            const responseMessagesbyKey1 = resultArray[0];
                return responseMessagesbyKey1;
            });
    
            paymentSystemOne = await PaymentSystem.attach(responseMessagesbyKey1);
    
            //trancaction 2
            await paymentSystemOne.connect(buyer2).triggerPurchasePostPayment();
    
            await mainSystem.connect(seller2).createSellingPost(10, 15);
            await mainSystem.connect(buyer1).createSellingPost(10, 10);
            await mainSystem.connect(buyer2).createSellingPost(20, 15);
            await mainSystem.connect(seller1).createSellingPost(20, 15);
            await mainSystem.connect(seller1).createResponseMessageToSellingPost(10, 15, 0);
            await mainSystem.connect(seller1).createResponseMessageToSellingPost(10, 10, 1);
            await mainSystem.connect(seller1).createResponseMessageToSellingPost(15, 15, 2);
            await mainSystem.connect(buyer1).createResponseMessageToSellingPost(15, 20, 3);
            
            await mainSystem.connect(buyer1).createPurchasePost(10, 15);
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);
            await mainSystem.connect(buyer2).createPurchasePost(20, 15);
            await mainSystem.connect(buyer2).createPurchasePost(20, 15);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 15, 2);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 10, 3);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(15, 15, 4);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(15, 20, 5);
    
            const responseMessagesbyKey2 = await mainSystem.returnSellingPostResponseMessagesByKey(0).then(resultArray => {
            const responseMessagesbyKey2 = resultArray[0];
                return responseMessagesbyKey2;
            });
            const responseMessagesbyKey3 = await mainSystem.returnSellingPostResponseMessagesByKey(1).then(resultArray => {
            const responseMessagesbyKey3 = resultArray[0];
                return responseMessagesbyKey3;
            });
    
            const responseMessagesbyKey4 = await mainSystem.returnSellingPostResponseMessagesByKey(2).then(resultArray => {
            const responseMessagesbyKey4 = resultArray[0];
                return responseMessagesbyKey4;
            });
    
            const responseMessagesbyKey5 = await mainSystem.returnSellingPostResponseMessagesByKey(3).then(resultArray => {
            const responseMessagesbyKey5 = resultArray[0];
                return responseMessagesbyKey5;
            });
    
            const responseMessagesbyKey6 = await mainSystem.returnPurchasePostResponseMessagesByKey(2).then(resultArray => {
            const responseMessagesbyKey6 = resultArray[0];
                return responseMessagesbyKey6;
            });
            const responseMessagesbyKey7 = await mainSystem.returnPurchasePostResponseMessagesByKey(3).then(resultArray => {
            const responseMessagesbyKey7 = resultArray[0];
                return responseMessagesbyKey7;
            });
    
            const responseMessagesbyKey8 = await mainSystem.returnPurchasePostResponseMessagesByKey(4).then(resultArray => {
            const responseMessagesbyKey8 = resultArray[0];
                return responseMessagesbyKey8;
            });
    
            const responseMessagesbyKey9 = await mainSystem.returnPurchasePostResponseMessagesByKey(5).then(resultArray => {
            const responseMessagesbyKey9 = resultArray[0];
                return responseMessagesbyKey9;
            });
    
            //trans 3 - 10
            paymentSystemTwo = await PaymentSystem.attach(responseMessagesbyKey2);
    
            await paymentSystemTwo.connect(seller1).triggerSellingPostPayment();
    
            paymentSystemThree = await PaymentSystem.attach(responseMessagesbyKey3);
    
            await paymentSystemThree.connect(seller1).triggerSellingPostPayment();
    
    
            paymentSystemFour = await PaymentSystem.attach(responseMessagesbyKey4);
    
            await paymentSystemFour.connect(seller1).triggerSellingPostPayment();
    
            paymentSystemFive = await PaymentSystem.attach(responseMessagesbyKey5);
    
            await paymentSystemFive.connect(buyer1).triggerSellingPostPayment();
    
            paymentSystemSix = await PaymentSystem.attach(responseMessagesbyKey6);
    
            await paymentSystemSix.connect(buyer1).triggerPurchasePostPayment();
    
            paymentSystemSeven = await PaymentSystem.attach(responseMessagesbyKey7);
    
            await paymentSystemSeven.connect(buyer1).triggerPurchasePostPayment();
    
            paymentSystemEight = await PaymentSystem.attach(responseMessagesbyKey8);
    
            await paymentSystemEight.connect(buyer2).triggerPurchasePostPayment();
    
            paymentSystemNine = await PaymentSystem.attach(responseMessagesbyKey9);
    
            await paymentSystemNine.connect(buyer2).triggerPurchasePostPayment();
    
        });
    
        it("test return Total Buy By Address", async function(){
            expect (await mainSystem.connect(buyer1).returnTotalBuyByAddress(buyer1.address)).to.equal(45);
            expect (await mainSystem.connect(buyer1).returnTotalBuyByAddress(buyer2.address)).to.equal(40);
            expect (await mainSystem.connect(buyer1).returnTotalBuyByAddress(seller1.address)).to.equal(35);
    
        });
    
        /*
    
        it("test return Total sell By Address", async function(){              
            expect (await mainSystem.connect(buyer1).returnTotalSellByAddress(seller1.address)).to.equal(85);
            expect (await mainSystem.connect(buyer1).returnTotalSellByAddress(seller2.address)).to.equal(10);
            expect (await mainSystem.connect(buyer1).returnTotalSellByAddress(buyer1.address)).to.equal(10);
            expect (await mainSystem.connect(buyer1).returnTotalSellByAddress(buyer2.address)).to.equal(15);
        });
    
        
    
        it("test return recent transaction", async function(){     
            //rencent lees than 10   
            const buyer1Recent = await mainSystem.connect(buyer1).returnRecentTransactions(buyer1.address);
            expect(buyer1Recent).to.have.lengthOf(5);
            //recent more or equal 10
            const seller1Recent = await mainSystem.connect(buyer1).returnRecentTransactions(seller1.address);
            expect(seller1Recent).to.have.lengthOf(10);
        });
    
    
        it("test weekly buy transaction", async function(){   
            //buyer1's weekly transaction (test day is friday)
            const buyer1Weekly = await mainSystem.connect(buyer1).returnWeeklyBuyStatistics(buyer1.address,0).then(resultArray => {
            const buyer1Weekly = resultArray[4];
                return buyer1Weekly;
            });
            expect(buyer1Weekly).to.equal(40);
            //buyer1's last week's weekly transaction
            const buyer1PreWeekly = await mainSystem.connect(buyer1).returnWeeklyBuyStatistics(buyer1.address,1).then(resultArray => {
            const buyer1PreWeekly = resultArray[4];
                return buyer1PreWeekly;
            });
            expect(buyer1PreWeekly).to.equal(0); 
            //seller1's weekly transaction
            const seller1Weekly = await mainSystem.connect(buyer1).returnWeeklyBuyStatistics(seller1.address,0).then(resultArray => {
            const seller1Weekly = resultArray[4];
                return seller1Weekly;
            });
            expect(seller1Weekly).to.equal(45);
            //seller1's weekly transaction, day before today no transaction
            const seller1WeeklyDayBefore = await mainSystem.connect(buyer1).returnWeeklyBuyStatistics(seller1.address,0).then(resultArray => {
            const seller1WeeklyDayBefore = resultArray[3];
                return seller1WeeklyDayBefore;
            });
            expect(seller1WeeklyDayBefore).to.equal(0);
            //seller1's 2 weeks ago' weekly transaction
            const seller1Pre2Weekly = await mainSystem.connect(buyer1).returnWeeklyBuyStatistics(seller1.address,2).then(resultArray => {
            const seller1Pre2Weekly = resultArray[4];
                return seller1Pre2Weekly;
            });
            expect(seller1Pre2Weekly).to.equal(0);
    
        });

        it("test weekly sell transaction", async function(){   
        //buyer1's weekly transaction (test day is friday)
        const buyer1Weekly = await mainSystem.connect(buyer1).returnWeeklySellStatistics(buyer1.address,0).then(resultArray => {
        const buyer1Weekly = resultArray[4];
            return buyer1Weekly;
        });
        expect(buyer1Weekly).to.equal(0);
        buyer1's last week's weekly transaction
        const buyer1PreWeekly = await mainSystem.connect(buyer1).returnWeeklySellStatistics(buyer1.address,1).then(resultArray => {
        const buyer1PreWeekly = resultArray[4];
            return buyer1PreWeekly;
        });
        expect(buyer1PreWeekly).to.equal(0); 
        //seller1's weekly transaction
        const seller1Weekly = await mainSystem.connect(buyer1).returnWeeklySellStatistics(seller1.address,0).then(resultArray => {
            const seller1Weekly = resultArray[4];
                return seller1Weekly;
            });
            expect(seller1Weekly).to.equal(20);
            
            //seller1's weekly transaction, day before today no transaction
            const seller1WeeklyDayBefore = await mainSystem.connect(buyer1).returnWeeklySellStatistics(seller1.address,0).then(resultArray => {
            const seller1WeeklyDayBefore = resultArray[3];
                return seller1WeeklyDayBefore;
            });
            expect(seller1WeeklyDayBefore).to.equal(0);
            //seller1's 2 weeks ago' weekly transaction
            const seller1Pre2Weekly = await mainSystem.connect(buyer1).returnWeeklySellStatistics(seller1.address,2).then(resultArray => {
            const seller1Pre2Weekly = resultArray[4];
                return seller1Pre2Weekly;
            });
            expect(seller1Pre2Weekly).to.equal(0); 
    
        });
        */
    
        
    });
           
    