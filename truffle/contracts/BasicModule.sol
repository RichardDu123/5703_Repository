//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BasicModule {

    // To-do
    // uint public suggestedPriceInWei = 1000; 

    // map account address to the user information in the system
    mapping(address => User) public userMap;
    struct User{
        string username;      // nickname
        uint availableElecUnits; // units of electricity available
        uint[] purchasePostKeys; // indexes of purchase posts published by user
        uint[] sellingPostsKeys;  // indexes of selling posts published by user
    }

    // events
    event PurchasePostCreated(address creator, uint postKey, uint _priceToBuy, uint _amountToBuy);
    event SellingPostCreated(address creator, uint postKey, uint _priceToBuy, uint _amountToBuy);
    event PurchasePostResponseMessageCreated(address creator, address responseMessageAddress);
    event SellingPostResponseMessageCreated(address creator, address responseMessageAddress);
    event PurchasePostPaymentSuccess(uint paymentAmount, uint purchasePostKey, address responseMessageAddress);
    event SellingPostPaymentSuccess(uint paymentAmount, uint sellingPostKey, address responseMessageAddress);



}