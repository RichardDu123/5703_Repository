//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BeanStructs.sol";
import "./BuyerService.sol";
import "./SellerService.sol";
import "./UserService.sol";
import "./StatisticsService.sol";

// system contract
contract MainSystem is BeanStructs {

    UserService private  userService;
    StatisticsService private statisticsService;
    BuyerService private  buyerService;
    SellerService  private sellerService;
    
    // ------------------------- constructor ------------------------- 
    constructor() {
        // 1.initialize services and mount them to reference variables
        userService = new UserService(address(this));
        statisticsService = new StatisticsService();
        buyerService = new BuyerService(statisticsService, userService);       
        sellerService = new SellerService(statisticsService, userService);      
        userService.initializeContractAddresses(address(buyerService), address(sellerService)); 
    }

    // -------------------------buyer service API -------------------------
    
    // buyer -  create a new purchase post
    function createPurchasePost (uint _priceToBuy, uint _amountToBuy) public {
        buyerService.createPurchasePost(_priceToBuy, _amountToBuy, msg.sender);
    }

    // seller - create purchase post response messages
    function createResponseMessageToPurchasePost(uint _amountToSell, uint _quotationInWei, uint _purchasePostKey) public {
        buyerService.createResponseMessageToPurchasePost(_amountToSell, _quotationInWei, _purchasePostKey, msg.sender);
    }

    // returns all purchase posts by user address
    function returnAllPurchasePostsByAddress(address _account) public view returns (PurchasePost[] memory) {
        return buyerService.returnAllPurchasePostsByAddress(_account);
    }

     // return total number of purchase posts in the system
    function returnPurchasePostMapSize() public view returns(uint) {
        return buyerService.returnPurchasePostMapSize();
    }

    // return one purchase post by user address and post key
    function getPurchasePostByKey(uint _postKey) public view returns(PurchasePost memory) {
        return buyerService.getPurchasePostByKey(_postKey);
    }

    // return all response messages of a purchase post by post key
    function returnPurchasePostResponseMessagesByKey(uint _postKey) public view returns(PostResponseMessage[] memory){
        return returnPurchasePostResponseMessagesByKey(_postKey);
    }

    // ------------------------- seller service API -------------------------

    // seller -  create a new selling post
    function createSellingPost (uint _priceToSell, uint _amountToSell) public {
        sellerService.createSellingPost(_priceToSell, _amountToSell, msg.sender);
    }
     
    // buyer - create selling post response messages
    // buyer creates response message and wait for confirmation from seller. buyer then pays for it once response is accepted
    function createResponseMessageToSellingPost(uint _amountToBuy, uint _quotationInWei, uint _sellingPostKey) public {
        sellerService.createResponseMessageToSellingPost(_amountToBuy, _quotationInWei, _sellingPostKey, msg.sender);
    }


    // returns all selling posts by user address
    function returnAllSellingPostsByAddress(address _account) public view returns (SellingPost[] memory) {
        return sellerService.returnAllSellingPostsByAddress(_account);
    }

    // return one selling post by post key
    function getSellingPostByKey(uint _postKey) public view returns(SellingPost memory) {
        return sellerService.getSellingPostByKey(_postKey);
    }

    // return all response messages of one post by key
    function returnSellingPostResponseMessagesByKey(uint _postKey) public view returns(PostResponseMessage[] memory){
        return sellerService.returnSellingPostResponseMessagesByKey(_postKey);
    }

    // ------------------------- user service API -------------------------

    function getUsernameByAddress(address _user) public view returns (string memory) {
        return userService.getUsername(_user);
    }

    // return available electricity units by account address
    function getAvailableElecUnitsByAccountAddress(address _user) public view returns (uint) {
        return userService.getAvailableElecUnits(_user);
    }

    function setUsername(address _user, string memory _username) public {
        userService.setUsername(_user, _username);
    }  


    // -------------------------statistics service API -------------------------

    function returnTotalBuyByAddress(address _accountAdress) public view returns (uint) {
        return statisticsService.returnTotalBuyByAddress(_accountAdress);
    }

    function returnTotalSellByAddress(address _accountAdress) public view returns (uint) {
        return statisticsService.returnTotalSellByAddress(_accountAdress);
    }

    // return 10 recent transactions (return all if transactions if total amount is less than 10)
    function returnRecentTransactions(address _account) public view returns (TransactionBean[] memory)  {
        return statisticsService.returnRecentTransactions(_account);
    }

    

}