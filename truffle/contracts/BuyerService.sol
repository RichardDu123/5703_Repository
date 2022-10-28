
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BeanStructs.sol";
import "./UserService.sol";
import "./StatisticsService.sol";
import "./Division.sol";

contract BuyerService is BeanStructs {

    // ------------------------- storage variables -------------------------

    // map each purchase post to an index
    mapping(uint => PurchasePost) purchasePostMap;
    mapping(uint => bool) PurchasePostStatus;       // label purchase post status
    uint[]  purchasePostKeys;                       // array of keys of purchase posts 
    uint public purchasePostCounter;                // count total number of purchase posts, start from 0
    
    string public recentAveragePriceforBuy;         // string to store the float number
    uint[] public averagePriceforBuy = new uint[](100); //array to store the average transaction price, set length as 100
    uint public averagePriceforBuyKey;              // key of averagePrice array
    bool private reachSizeLimit;                    // identify if the size limit of averagePrice array is reached

    // reference to statistics service
    StatisticsService statisticsService;
    UserService userService;
    Division divisionUtils;
    
    constructor(StatisticsService _statisticsService, UserService _userService, Division _divisionUtils) {
        statisticsService = _statisticsService;
        userService = _userService;
        divisionUtils = _divisionUtils;
    }

    // events
    event PurchasePostCreated(address creator, uint postKey, uint _priceToBuy, uint _amountToBuy);
    event PurchasePostResponseMessageCreated(address creator, address responseMessageAddress);
    event PurchasePostPaymentSuccess(uint paymentAmount, uint purchasePostKey, address responseMessageAddress);


   
    // ------------------------- buyer side interaction -------------------------
    
    // buyer -  create a new purchase post
    function createPurchasePost (uint _priceToBuy, uint _amountToBuy, address _msgSender) public {
            
            // 1. data validation
            require(_priceToBuy > 0, "purchase price must be greater than 0");
            require(_amountToBuy > 0, "amount to buy must be greater than 0");
            
            // 2. save information to the purchase post map
            purchasePostMap[purchasePostCounter].priceToBuy = _priceToBuy;
            purchasePostMap[purchasePostCounter].amountToBuy = _amountToBuy;          
            purchasePostMap[purchasePostCounter].buyer = _msgSender;
            purchasePostMap[purchasePostCounter].enabled = true;
            purchasePostMap[purchasePostCounter].createdAt = block.timestamp;

            // 3. set post status to true 
            PurchasePostStatus[purchasePostCounter] = true;
            
            // 4. save post key to user struct
            // userMap[_msgSender].purchasePostKeys.push(purchasePostCounter);
            userService.savePurchasePostKey(_msgSender, purchasePostCounter);
           
            // 5. emit event
            emit PurchasePostCreated( _msgSender, purchasePostCounter, _priceToBuy, _amountToBuy);

            // 6. increment purchase post counter by 1
            purchasePostCounter++;


    }


    // seller - create purchase post response messages
    function createResponseMessageToPurchasePost(uint _amountToSell, uint _quotationInWei, uint _purchasePostKey, address _msgSender) public {
        
        // 1. data validation
        require(_amountToSell > 0, "amount must be greater than 0");
        require(_quotationInWei > 0, "quotation must be greater than 0");
        require(_purchasePostKey >= 0, "post key starts from 0");
        require(_msgSender != purchasePostMap[_purchasePostKey].buyer, "You cannot reply to your own purchase post");

        // 2. create a new response message
        uint messageIndex = purchasePostMap[_purchasePostKey].responseMessages.length;
        PostResponseMessage message = new PostResponseMessage(address(this), _msgSender, _amountToSell, _quotationInWei, 0, _purchasePostKey, messageIndex );
        
        // 3. add the response message to the corresponding purchase post 
        purchasePostMap[_purchasePostKey].responseMessages.push() = message;
        userService.addResponse(_msgSender, message);

        // 4. emit event
        emit PurchasePostResponseMessageCreated( _msgSender, address(message));

    }

    // handle payment process from response message, this method will only be called by triggerPurchasePostPayment function in PostResponseMessage contract
    function handlePurchasePostPostPayment(uint _purchasePostKey, uint _responseMessageIndex) public payable returns (string memory) {
        
        // 1.1 data validation
        PostResponseMessage responseMessage = purchasePostMap[_purchasePostKey].responseMessages[_responseMessageIndex];
        require(address(responseMessage) == msg.sender, "message sender should only be the response message that triggers payment process");  
        // 1.2 get current time
        uint transactionTime = block.timestamp;

        
        // 2.1 update seller's account information
        address seller = responseMessage.messageSender();
        require( userService.getAvailableElecUnits(seller) >= responseMessage.amount(), "Insufficient electricity units in account");
        // userMap[seller].availableElecUnits -= responseMessage.amount();
        userService.setAvailableElecUnits(seller, userService.getAvailableElecUnits(seller) - responseMessage.amount());

        // 2.2 update seller's statistics (statistics service required)
        statisticsService.updateTotalSell(seller, responseMessage.amount());
        statisticsService.addOneElectricSellTransaction(seller, transactionTime, responseMessage.amount());
        // 2.2.1 update seller's transaction sequence map to record all transactions regardless of type in sequential order (statistics service required)
        statisticsService.addTransactionToSequenceMap(seller, 1, transactionTime);

        // 3.1 update buyer's account information
        address buyer = purchasePostMap[_purchasePostKey].buyer;
        // userMap[buyer].availableElecUnits += responseMessage.amount();   
        userService.setAvailableElecUnits(buyer, userService.getAvailableElecUnits(buyer) + responseMessage.amount());     
        
        // 3.2 update buyer's statistics (statistics service required)
        statisticsService.updateTotalBuy(buyer, responseMessage.amount());
        statisticsService.addOneElectricBuyTransaction(buyer, transactionTime, responseMessage.amount());
        // 3.2.1 update buyer's transaction sequence map (statistics service required)
        statisticsService.addTransactionToSequenceMap(buyer, 0, transactionTime);
        
        // 4. update purchase post information
        // 1) deduct purchase amount accordingly 
        require(purchasePostMap[_purchasePostKey].amountToBuy >= responseMessage.amount(), "The sales quantity should be less than or equal to the purchase demand");
        purchasePostMap[_purchasePostKey].amountToBuy -= responseMessage.amount();
        // 2) set post to disabled if sales quantity match purchase demand 
        if (purchasePostMap[_purchasePostKey].amountToBuy == 0) {
            purchasePostMap[_purchasePostKey].enabled = false;
        }

        // 5. record unit transaction price
        if (averagePriceforBuyKey == 100){
            reachSizeLimit = true;
            averagePriceforBuyKey = 0;
        }
        averagePriceforBuy[averagePriceforBuyKey++] = responseMessage.quotationInWei();

        // 6. transfer ether to seller's account
        payable(seller).transfer(msg.value);
        
        // 7. emit event
        emit PurchasePostPaymentSuccess(msg.value, _purchasePostKey, address(responseMessage));
        // 8. return success message
        return "success";
        
    }

    // update the unit transaction price into array
    function updateRecentAveragePriceforBuy() public {
        uint recentTotalPriceforBuy = 0;
        for (uint i = 0; i < averagePriceforBuy.length; i++) {
            recentTotalPriceforBuy += averagePriceforBuy[i];
        }
        if (reachSizeLimit) {
            (, , recentAveragePriceforBuy) = divisionUtils.division(3, recentTotalPriceforBuy, 100);
        } else {
            (, , recentAveragePriceforBuy) = divisionUtils.division(3, recentTotalPriceforBuy, averagePriceforBuyKey);
        }
    }


    // ------------------------- buyer side utils -------------------------
    
    // returns all purchase posts by user address
    function returnAllPurchasePostsByAddress(address _account) public view returns (PurchasePost[] memory) {
        // uint[] memory keys = userMap[_account].purchasePostKeys;
        uint[] memory keys = userService.getPurchasePostKeys(_account);
        PurchasePost[] memory purchasePosts = new PurchasePost[](keys.length);
        for (uint i = 0; i < keys.length; i++) {
            purchasePosts[i]  = purchasePostMap[keys[i]]; 
        }
        return purchasePosts;
    }

    // return total number of purchase posts in the system
    function returnPurchasePostMapSize() public view returns(uint) {
        return purchasePostCounter;
    }

    // return one purchase post by key
    function getPurchasePostByKey(uint _postKey) public view returns(PurchasePost memory) {
        return purchasePostMap[_postKey];
    }

    // return all response messages of a purchase post by post key
    function returnPurchasePostResponseMessagesByKey(uint _postKey) public view returns(PostResponseMessage[] memory){
        require(_postKey >= 0, "post key starts from 0");
        return purchasePostMap[_postKey].responseMessages;
    }
    
    // return the recent average price for buy transaction
    function returnRecentAveragePriceforBuy() public view returns (string memory) {
        return recentAveragePriceforBuy;
    }


}
