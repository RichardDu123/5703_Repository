
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PostResponseMessage.sol";
import "./BasicModule.sol";

contract BuyerModule is BasicModule {

    // ------------------------- storage variables -------------------------

    // map each purchase post to an index
    mapping(uint => PurchasePost) purchasePostMap;
    mapping(uint => bool) PurchasePostStatus;       // label purchase post status
    uint[]  purchasePostKeys;                        // array of keys of purchase posts 
    uint public purchasePostCounter;                   // count total number of purchase posts, start from 0
  
    struct PurchasePost{
        uint priceToBuy;
        uint amountToBuy;
        address buyer;
        bool enabled;
        uint createdAt;
        PostResponseMessage[] responseMessages;  // response messages attached to this purchase post 
    }
   
    // ------------------------- buyer side interaction -------------------------
    
    // buyer -  create a new purchase post
    function createPurchasePost (uint _priceToBuy, uint _amountToBuy) public {
            
            // 1. data validation
            require(_priceToBuy > 0, "purchase price must be greater than 0");
            require(_amountToBuy > 0, "amount to buy must be greater than 0");
            
            // 2. save information to the purchase post map
            purchasePostMap[purchasePostCounter].priceToBuy = _priceToBuy;
            purchasePostMap[purchasePostCounter].amountToBuy = _amountToBuy;          
            purchasePostMap[purchasePostCounter].buyer = msg.sender;
            purchasePostMap[purchasePostCounter].enabled = true;
            purchasePostMap[purchasePostCounter].createdAt = block.timestamp;

            // 3. set post status to true 
            PurchasePostStatus[purchasePostCounter] = true;
            
            // 4. save post key to user struct
            userMap[msg.sender].purchasePostKeys.push(purchasePostCounter);
           
            // 5. emit event
            emit PurchasePostCreated( msg.sender, purchasePostCounter, _priceToBuy, _amountToBuy);

            // 6. increment purchase post counter by 1
            purchasePostCounter++;


    }


    // seller - create purchase post response messages
    function createResponseMessageToPurchasePost(uint _amountToSell, uint _quotationInWei, uint _purchasePostKey) public {
        
        // 1. data validation
        require(_amountToSell > 0, "amount must be greater than 0");
        require(_quotationInWei > 0, "quotation must be greater than 0");
        require(_purchasePostKey >= 0, "post key starts from 0");
        require(msg.sender != purchasePostMap[_purchasePostKey].buyer, "You cannot reply to your own purchase post");

        // 2. create a new response message
        uint messageIndex = purchasePostMap[_purchasePostKey].responseMessages.length;
        PostResponseMessage message = new PostResponseMessage(address(this), msg.sender, _amountToSell, _quotationInWei, 0, _purchasePostKey, messageIndex );
        
        // 3. add the response message to the corresponding purchase post 
        purchasePostMap[_purchasePostKey].responseMessages.push() = message;

        // 4. emit event
        emit PurchasePostResponseMessageCreated( msg.sender, address(message));

    }

    // handle payment processes from response message
    function triggerPayment(uint _purchasePostKey, uint _responseMessageIndex) public payable {
        
        // 1. data validation
        PostResponseMessage responseMessage = purchasePostMap[_purchasePostKey].responseMessages[_responseMessageIndex];
        require(address(responseMessage) == msg.sender, "Only response messages are allowed to trigger payment process");
        
        
        // 2. update seller's account information
        address seller = responseMessage.messageSender();
        require( userMap[seller].availableElecUnits >= responseMessage.amount(), "Insufficient electricity units in account");
        userMap[seller].availableElecUnits -= responseMessage.amount();
        
        // 3. update buyer's account information
        address buyer = purchasePostMap[_purchasePostKey].buyer;
        userMap[buyer].availableElecUnits += responseMessage.amount();
        
        // 4. update purchase post
        // 1) deduct purchase amount accordingly 
        require(purchasePostMap[_purchasePostKey].amountToBuy >= responseMessage.amount(), "The sales quantity should be less than or equal to the purchase demand");
        purchasePostMap[_purchasePostKey].amountToBuy -= responseMessage.amount();
        // 2) set post to disabled if sales quantity match purchase demand 
        if (purchasePostMap[_purchasePostKey].amountToBuy == 0) {
            purchasePostMap[_purchasePostKey].enabled = false;
        }

        // 5. transfer ether to seller's account
        payable(seller).transfer(msg.value);

        emit PurchasePostPaymentSuccess(msg.value, _purchasePostKey, address(responseMessage));
        
    }

}
