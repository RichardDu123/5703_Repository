//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PostResponseMessage.sol";
import "./BasicModule.sol";

contract SellerModule is BasicModule {

    // ------------------------- seller side storage variables -------------------------

    // map each purchase post to an index
    mapping(uint => SellingPost) sellingPostMap;
    mapping(uint => bool) sellingPostStatus;       // label purchase post status
    uint[]  sellingPostKeys;                        // array of keys of purchase posts 
    uint public sellingPostCounter;                   // count total number of purchase posts, start from 0

    // selling post storage structure
    struct SellingPost{
        uint priceToSell;
        uint amountToSell;
        address seller;
        bool enabled;
        uint createdAt;
        PostResponseMessage[] responseMessages;
    }
    

    // ------------------------- seller side interaction -------------------------

    // seller -  create a new selling post
    function createSellingPost (uint _priceToSell, uint _amountToSell) public {
            
            // 1. data validation
            require(_priceToSell > 0, "purchase price must be greater than 0");
            require(_amountToSell > 0, "amount to buy must be greater than 0");
            
            // 2. save information to the selling post map
            sellingPostMap[sellingPostCounter].priceToSell = _priceToSell;
            sellingPostMap[sellingPostCounter].amountToSell = _amountToSell;          
            sellingPostMap[sellingPostCounter].seller = msg.sender;
            sellingPostMap[sellingPostCounter].enabled = true;
            sellingPostMap[sellingPostCounter].createdAt = block.timestamp;

            // 3. set post status to true 
            sellingPostStatus[sellingPostCounter] = true;
            
            // 4. save post key to user struct
            userMap[msg.sender].sellingPostsKeys.push(sellingPostCounter);
           
            // 5. emit event
            emit SellingPostCreated( msg.sender, sellingPostCounter, _priceToSell, _amountToSell);

            // 6. increment selling post counter by 1
            sellingPostCounter++;

    }

    // buyer - create selling post response messages
    // buyer creates response message and wait for confirmation from seller. buyer then pays for it once response is accepted
    function createResponseMessageToSellingPost(uint _amountToBuy, uint _quotationInWei, uint _sellingPostKey) public {
        
        // 1. data validation
        require(_amountToBuy > 0, "amount must be greater than 0");
        require(_quotationInWei > 0, "quotation must be greater than 0");
        require(_sellingPostKey >= 0, "post key starts from 0");
        require(msg.sender != sellingPostMap[_sellingPostKey].seller, "You cannot reply to your own selling post");

        // 2. create a new response message
        uint messageIndex = sellingPostMap[_sellingPostKey].responseMessages.length;
        PostResponseMessage message = new PostResponseMessage(address(this), msg.sender, _amountToBuy, _quotationInWei, 1, _sellingPostKey, messageIndex );
        
        // 3. add the response message to the corresponding selling post 
        sellingPostMap[_sellingPostKey].responseMessages.push() = message;

        // 4. emit event
        emit SellingPostResponseMessageCreated(msg.sender, address(message));

    }

    //  
    function handleSellingPostPayment(uint _sellingPostKey, uint _responseMessageIndex) public payable {
        
        // 1. data validation & get response message contract reference
        PostResponseMessage responseMessage = sellingPostMap[_sellingPostKey].responseMessages[_responseMessageIndex];
        require(address(responseMessage) == msg.sender, "Only response messages are allowed to trigger payment process");
        

        // 2. update buyer's account information
        address buyer = responseMessage.messageSender();
        userMap[buyer].availableElecUnits += responseMessage.amount();
        
        // 3. update seller's account information
        address seller = sellingPostMap[_sellingPostKey].seller;
        require( userMap[seller].availableElecUnits >= responseMessage.amount(), "Insufficient electricity units in seller's account");
        userMap[seller].availableElecUnits -= responseMessage.amount();
        
        
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

}