//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BuyerModule.sol";
import "./SellerModule.sol";

// system contract
contract MainSystem is BuyerModule, SellerModule {

    // ------------------------- constructor ------------------------- 
    constructor() {
        // initialize testing data, allocate 100 units of electricity to test account
        address testAccount = 0xFf6f3A57c688d382Df20B09e5fCAB66Cc61DBc22;
        userMap[testAccount].availableElecUnits = 100;
    }

    // ------------------------- utils -------------------------

    // return total number of purchase posts in the system
    function returnPurchasePostMapSize() public view returns(uint) {
        return purchasePostCounter;
    }

    // return one purchase post by key
    function getPurchasePostByKey(uint _postKey) public view returns(PurchasePost memory) {
        return purchasePostMap[_postKey];
    }

     // return one selling post by key
    function getSellingPostByKey(uint _postKey) public view returns(SellingPost memory) {
        return sellingPostMap[_postKey];
    }

   // return all response messages of one post by key
    function returnPurchasePostResponseMessagesByKey(uint _postKey) public view returns(PostResponseMessage[] memory){
        require(_postKey >= 0, "post key starts from 0");
        return purchasePostMap[_postKey].responseMessages;
    }

    // return all response messages of one post by key
    function returnSellingPostResponseMessagesByKey(uint _postKey) public view returns(PostResponseMessage[] memory){
        require(_postKey >= 0, "post key starts from 0");
        return sellingPostMap[_postKey].responseMessages;
    }

    // return units of electricity available by address
    function getAvailableElecUnitsByAccountAddress(address _account) public view returns(uint){
        return userMap[_account].availableElecUnits;
    }
    

}