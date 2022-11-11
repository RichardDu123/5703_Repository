// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract PostResponseMessage {
    
    address public messageSender;
    uint public initialAmount;
    uint public amount;
    uint public quotationInWei;
    uint8 public responseMessageType;   // 0 - purchase post response; 1 - selling post response
    uint public postKey;                // identify which purchase post it belongs to
    uint public messageIndex;           // index of message in array
    bool public isAccepted;             // identify if response message is accepted
    bool public isPaid;
    uint public createdAt;
    
    
    // reference to system contract
    address systemContractAddress;

    event responseMessageAccepted(uint responseMessageType, uint postKey, uint messageIndex);


    constructor(address _systemContractAddress, address _messageSender, uint _amount, uint _quotationInWei, uint8 _responseMessageType, uint _postKey, uint _messageIndex)  {
        systemContractAddress = _systemContractAddress;
        messageSender = _messageSender;
        amount = _amount;
        initialAmount = amount;
        quotationInWei = _quotationInWei;
        responseMessageType = _responseMessageType;
        postKey = _postKey;
        messageIndex = _messageIndex;
        isAccepted = false;
        isPaid = false;
        createdAt = block.timestamp;
    }

    //  isAccepted variable setter
    function setIsAccepted(bool _isAccepted) public {
        isAccepted = _isAccepted;
        emit responseMessageAccepted(responseMessageType, postKey, messageIndex);
    }

    receive() external payable {
        // 1. data validation
        // 1.1 ether has to be positive value; response has to be accpeted before making a payment
        require(msg.value > 0 , "invalid payment");
        require(isAccepted == true, "your response has not been accepted by seller yet");
        
        // 1.2 response message only accept full payment; response cannot be paid twice
        require(amount * quotationInWei == msg.value, "Not fully paid yet"); 
        require(isPaid == false, "Order is already paid!");

        // 2. invoke payment function based on response message type
        if (responseMessageType == 0) {
            triggerPurchasePostPayment();
        } else if (responseMessageType == 1){
            triggerSellingPostPayment();
        } else {
            require(false, "invalid response message type");
        }
        
    }


    // trigger seller side payment process
    function triggerSellingPostPayment() public payable {
        // Only the message sender who sent this response to acquire electricity units can make a payment.
        require(msg.sender == messageSender, "Only the message sender who sent this response to acquire electricity units can make a payment"); 

        // 2. transfer received ether to system contract for further processing
        (bool success, ) = systemContractAddress.call{value:msg.value}(abi.encodeWithSignature("handleSellingPostPayment(uint256,uint256)", postKey, messageIndex));
        
        // 3. if the payment process handled by the system contract failed, rollback the whole transaction
        require(success, "payment failed");
        isPaid = true;
    }

    // trigger buyer side payment process
    function triggerPurchasePostPayment() public payable{
        // 1. You cannot make a payment to your own selling response message when you try to sell your
        require(msg.sender != messageSender, "You cannot make a payment to your own selling response message");

        // 2. transfer received ether to system contract
        (bool success, ) = systemContractAddress.call{value:msg.value}(abi.encodeWithSignature("handlePurchasePostPostPayment(uint256,uint256)", postKey, messageIndex));
        // 3. if the payment process handled by the system contract failed, rollback the whole transaction
        require(success, "payment failed");
        isPaid = true;
    }

    struct PostResponseMessageBean {
        address messageSender;
        uint amount;
        uint quotationInWei;
        uint8 responseMessageType;   // 0 - purchase post response; 1 - selling post response
        uint postKey;                // identify which purchase post it belongs to
        uint messageIndex;           // index of message in array
        bool isAccepted;             // identify if response message is accepted
        bool isPaid;
        uint createdAt;
    }

    function returnPostResponseMessageBean() public view returns(PostResponseMessageBean memory) {
        
        PostResponseMessageBean memory bean;
        bean.messageSender = messageSender;
        bean.amount = amount;
        bean.quotationInWei = quotationInWei;
        bean.responseMessageType = responseMessageType;
        bean.postKey = postKey;
        bean.messageIndex = messageIndex;
        bean.isAccepted = isAccepted;
        bean.isPaid = isPaid;
        bean.createdAt = createdAt;
        
        return bean;

    }

}