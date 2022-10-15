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

    });

    describe("payment for purchase post", function() {
        let paymentSystem;
        //creat selling post and response message before each test for payment
        beforeEach("pre process for the payment", async function () {
            await mainSystem.connect(buyer1).createPurchasePost(10, 10);                   
            await mainSystem.connect(buyer2).createPurchasePost(20, 10);
            await mainSystem.connect(seller1).createResponseMessageToPurchasePost(10, 10, 0);
            await mainSystem.connect(seller2).createResponseMessageToPurchasePost(20, 10, 0);  

            const responseMessagesbyKey = await mainSystem.connect(seller1).returnPurchasePostResponseMessagesByKey(0).then(resultArray => {
            const responseMessagesbyKey = resultArray[0];
                return responseMessagesbyKey;
            });

            const PaymentSystem = await ethers.getContractFactory("PostResponseMessage")

            paymentSystem = await PaymentSystem.attach(responseMessagesbyKey);      
        });

        it("test amount", async function(){
            
            await paymentSystem.triggerPurchasePostPayment();
            const resBuyer =  await mainSystem.connect(seller1).getAvailableElecUnitsByAccountAddress(buyer1.address);
            console.log(resBuyer.toNumber());
            expect(await resBuyer.toNumber()).to.equal(10);
            const resSeller =  await mainSystem.connect(seller1).getAvailableElecUnitsByAccountAddress(seller1.address);
            console.log(resSeller.toNumber());
            expect(await resSeller.toNumber()).to.equal(90);
        });


    });

    //use new added elec unit to post sell post see if it works
        
  
    

});