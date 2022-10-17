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
        address admin = msg.sender;
        userService.initializeContractAddresses(address(buyerService), address(sellerService), admin); 
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
        return buyerService.returnPurchasePostResponseMessagesByKey(_postKey);
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

    //new
    function returnSellPostMapSize() public view returns(uint){
        return sellerService.returnSellPostMapSize();
    }

    // ------------------------- user service API -------------------------

    // return username by user's account address
    function getUsernameByAddress(address _user) public view returns (string memory) {
        return userService.getUsername(_user);
    }

    // return available electricity units by account address
    function getAvailableElecUnitsByAccountAddress(address _user) public view returns (uint) {
        return userService.getAvailableElecUnits(_user);
    }

    // return an array contaning all purchase post keys that are published by a user
    function getPurchasePostKeys(address _user) public view returns (uint[] memory) {
        return userService.getPurchasePostKeys(_user);
    }

    // return an array contaning all selling post keys that are published by a user
    function getSellingPostKeys(address _user) public view returns (uint[] memory) {
        return userService.getSellingPostKeys(_user);
    }

    // set username
    function setUsername(address _user, string memory _username) public {
        userService.setUsername(_user, _username);
    }  

    // return all response messages of user by user address
    function returnAllResponses(address _user) public view returns (PostResponseMessage[] memory) {
        return userService.returnAllResponses(_user);
    } 
    

    // -------------------------statistics service API -------------------------

    // return total buy amount by user's account address
    function returnTotalBuyByAddress(address _accountAddress) public view returns (uint) {
        return statisticsService.returnTotalBuyByAddress(_accountAddress);
    }
    
    // return total buy amount by user's account address
    function returnTotalSellByAddress(address _accountAddress) public view returns (uint) {
        return statisticsService.returnTotalSellByAddress(_accountAddress);
    }

    // return 10 recent transactions (return all if transactions if total amount is less than 10)
    function returnRecentTransactions(address _account) public view returns (TransactionBean[] memory)  {
        return statisticsService.returnRecentTransactions(_account);
    }

    /*
        return weekly buy transactions statistics:
            _user: identify target user
            _prevWeekNum: identify which week's statistics to retrieve. Value starts from 0
                0: indicating current week
                1: previous week
                2: 2 weeks ago
                ...  
    */
    function returnWeeklyBuyStatistics(address _user, uint _prevWeekNum) public view returns (uint[] memory) {
        return statisticsService.returnWeeklyStatistics(_user, _prevWeekNum, 0);
    }

    /*
        return weekly sell transactions statistics:
            _user: identify target user
            _prevWeekNum: identify which week's statistics to retrieve. Value starts from 0
                0: indicating current week
                1: previous week
                2: 2 weeks ago
                ...  
    */
    function returnWeeklySellStatistics(address _user, uint _prevWeekNum) public view returns (uint[] memory) {
        return statisticsService.returnWeeklyStatistics(_user, _prevWeekNum, 1);
    }

    /*
        return weekly total buy and total sell:
            _user: identify target user
            _prevWeekNum: identify which week's statistics to retrieve. Value starts from 0
                0: indicating current week
                1: previous week
                2: 2 weeks ago
                ...  
        return format:[WeeklyTotalBuy, WeeklyTotalSell]
    */
    function returnWeeklyTotalBuyAndSell(address _user, uint _prevWeekNum) public view returns (uint[2] memory) {
        uint weeklyBuy = statisticsService.returnWeeklyTotalBuyOrSell(_user, _prevWeekNum, 0);
        uint weeklySell = statisticsService.returnWeeklyTotalBuyOrSell(_user, _prevWeekNum, 1);
        uint[2] memory result = [weeklyBuy, weeklySell];
        return result;   
    }
    
    // -------------------------admin API -------------------------

    // add electricity units
    function addAvailableElecUnits(address _user, uint  _units) public {
        userService.addAvailableElecUnits(_user, _units);
    }  


}
