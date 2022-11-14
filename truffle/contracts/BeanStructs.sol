//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PostResponseMessage.sol";

contract BeanStructs {
 
    // ------------------------- buyer module bean -------------------------
    struct PurchasePost{
        uint priceToBuy;
        uint initialAmountToBuy;
        uint amountToBuy;
        address buyer;
        bool enabled;
        uint createdAt;
        PostResponseMessage[] responseMessages;  // response messages attached to this purchase post 
    }

    // ------------------------- seller module bean -------------------------
    // selling post storage structure
    struct SellingPost{
        uint priceToSell;
        uint initialAmountToSell;
        uint amountToSell;
        address seller;
        bool enabled;
        uint createdAt;
        PostResponseMessage[] responseMessages;
    }
    
    // ------------------------- statistics module bean -------------------------
    // encapsulate recent transactions units
    struct TransactionBean {
        uint createdAt;
        uint transactionType;
        uint transactionValue;
    }

    // encapsulate weekly buy unit
    struct WeeklyBuyBean {
        uint dayNum;        // range:1 - 7;  1 - Monday, 2 - Tuesday, 3 -Wednesday ...
        uint totalSum;      // total buy amount on a certain day
    }

    // ------------------------- PostResponseMessage bean -------------------------
    

}
