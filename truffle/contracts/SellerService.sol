//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BeanStructs.sol";
import "./UserService.sol";
import "./StatisticsService.sol";

contract SellerService is BeanStructs {

    // ------------------------- seller side storage variables -------------------------
    
    // map each purchase post to an index
    mapping(uint => SellingPost) sellingPostMap;
    mapping(uint => bool) sellingPostStatus;       // label purchase post status
    uint[]  sellingPostKeys;                        // array of keys of purchase posts 
    uint public sellingPostCounter;                  // count total number of purchase posts, start from 0
    

    // reference to statistics service
    StatisticsService statisticsService;
    UserService userService;
    
    constructor(StatisticsService _statisticsService, UserService _userService) {
        statisticsService = _statisticsService;
        userService = _userService;
    }

    // events
    event SellingPostCreated(address creator, uint postKey, uint _priceToBuy, uint _amountToBuy);
    event SellingPostResponseMessageCreated(address creator, address responseMessageAddress);
    event SellingPostPaymentSuccess(uint paymentAmount, uint sellingPostKey, address responseMessageAddress);
    

    // ------------------------- seller side interaction -------------------------

    // seller -  create a new selling post
    function createSellingPost (uint _priceToSell, uint _amountToSell, address _msgSender) public {
            
            // 1. data validation
            require(_priceToSell > 0, "purchase price must be greater than 0");
            require(_amountToSell > 0, "amount to buy must be greater than 0");
            
            // 2. save information to the selling post map
            sellingPostMap[sellingPostCounter].priceToSell = _priceToSell;
            sellingPostMap[sellingPostCounter].amountToSell = _amountToSell;          
            sellingPostMap[sellingPostCounter].seller = _msgSender;
            sellingPostMap[sellingPostCounter].enabled = true;
            sellingPostMap[sellingPostCounter].createdAt = block.timestamp;

            // 3. set post status to true 
            sellingPostStatus[sellingPostCounter] = true;
            
            // 4. save post key to user struct
            // userMap[msg.sender].sellingPostsKeys.push(sellingPostCounter);
            userService.saveSellingPostKey(_msgSender, sellingPostCounter);
           
            // 5. emit event
            emit SellingPostCreated( _msgSender, sellingPostCounter, _priceToSell, _amountToSell);

            // 6. increment selling post counter by 1
            sellingPostCounter++;
    }

    // buyer - create selling post response messages
    // buyer creates response message and wait for confirmation from seller. buyer then pays for it once response is accepted
    function createResponseMessageToSellingPost(uint _amountToBuy, uint _quotationInWei, uint _sellingPostKey, address _msgSender) public {
        
        // 1. data validation
        require(_amountToBuy > 0, "amount must be greater than 0");
        require(_quotationInWei > 0, "quotation must be greater than 0");
        require(_sellingPostKey >= 0, "post key starts from 0");
        require(_msgSender != sellingPostMap[_sellingPostKey].seller, "You cannot reply to your own selling post");

        // 2. create a new response message
        uint messageIndex = sellingPostMap[_sellingPostKey].responseMessages.length;
        PostResponseMessage message = new PostResponseMessage(address(this), _msgSender, _amountToBuy, _quotationInWei, 1, _sellingPostKey, messageIndex );
        
        // 3. add the response message to the corresponding selling post 
        sellingPostMap[_sellingPostKey].responseMessages.push() = message;
        userService.addResponse(_msgSender, message);

        // 4. emit event
        emit SellingPostResponseMessageCreated(_msgSender, address(message));

    }

    //  handle selling post payment process
    function handleSellingPostPayment(uint _sellingPostKey, uint _responseMessageIndex) public payable {
        
        // 1.1 data validation & get response message contract reference
        PostResponseMessage responseMessage = sellingPostMap[_sellingPostKey].responseMessages[_responseMessageIndex];
        require(address(responseMessage) == msg.sender, "Only response messages are allowed to trigger payment process");
        
        // 1.2 get current time
        uint transactionTime = block.timestamp;

        // 2.1 update buyer's account information
        address buyer = responseMessage.messageSender();
        // userMap[buyer].availableElecUnits += responseMessage.amount();   
        userService.setAvailableElecUnits(buyer, userService.getAvailableElecUnits(buyer) + responseMessage.amount() );

        // 2.2.1 update buyer's statistics (statistics service required)
        statisticsService.updateTotalBuy(buyer, responseMessage.amount());
        statisticsService.addOneElectricBuyTransaction(buyer, transactionTime, responseMessage.amount());
        // 2.2.2 update buyer's transaction sequence map (statistics service required)
        statisticsService.addTransactionToSequenceMap(buyer, 0, transactionTime);
        
        
        // 3.1 update seller's account information
        address seller = sellingPostMap[_sellingPostKey].seller;
        // require( userMap[seller].availableElecUnits >= responseMessage.amount(), "Insufficient electricity units in seller's account");
        require( userService.getAvailableElecUnits(seller) >= responseMessage.amount(), "Insufficient electricity units in seller's account");
        // userMap[seller].availableElecUnits -= responseMessage.amount();
        userService.setAvailableElecUnits(seller, userService.getAvailableElecUnits(seller) - responseMessage.amount() );

        // 3.2.1 update seller's statistics (statistics service required)
        statisticsService.updateTotalSell(seller, responseMessage.amount());
        statisticsService.addOneElectricSellTransaction(seller, transactionTime, responseMessage.amount());
        // 3.2.2 update seller's transaction sequence map to record all transactions regardless of type in sequential order (statistics service required)
        statisticsService.addTransactionToSequenceMap(seller, 1, transactionTime);
        
        
        // 4. update selling post
        // 1) decrease selling amount accordingly 
        require(sellingPostMap[_sellingPostKey].amountToSell >= responseMessage.amount(), "Insufficient selling units in selling post");
        sellingPostMap[_sellingPostKey].amountToSell -= responseMessage.amount();
        // 2) set post to disabled if available selling units in selling post are 0
        if ( sellingPostMap[_sellingPostKey].amountToSell == 0) {
            sellingPostMap[_sellingPostKey].enabled = false;
        }

        // 5. transfer ether to seller's account
        payable(seller).transfer(msg.value);

        emit SellingPostPaymentSuccess(msg.value, _sellingPostKey, address(responseMessage));
        
    }


    // ------------------------- seller side utils -------------------------
    
    // returns all selling posts by user address
    function returnAllSellingPostsByAddress(address _account) public view returns (SellingPost[] memory) {
        // uint[] memory keys = userMap[_account].sellingPostsKeys;
        uint[] memory keys = userService.getSellingPostKeys(_account);
        SellingPost[] memory sellingPosts = new SellingPost[](keys.length);
        for (uint i = 0; i < keys.length; i++) {
            sellingPosts[i]  = sellingPostMap[keys[i]]; 
        }
        return sellingPosts;
    }

    // return one selling post by post key
    function getSellingPostByKey(uint _postKey) public view returns(SellingPost memory) {
        return sellingPostMap[_postKey];
    }

    // return all response messages of one post by key
    function returnSellingPostResponseMessagesByKey(uint _postKey) public view returns(PostResponseMessage[] memory){
        require(_postKey >= 0, "post key starts from 0");
        return sellingPostMap[_postKey].responseMessages;
    }

    //new
    // return total number of sell posts in the system
    function returnSellPostMapSize() public view returns(uint) {
        return sellingPostCounter;
    }

}
