//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PostResponseMessage.sol";

contract UserService {

    // To-do
    // uint public suggestedPriceInWei = 1000; 

    // map account address to the user information in the system
    mapping(address => User) private userMap;
    address mainSystemAddress;
    address buyerServiceAddress;
    address sellerServiceAddress;
    address adminAddress;

    struct User{
        string username;      // nickname
        uint availableElecUnits; // units of electricity available
        uint[] purchasePostKeys; // indexes of purchase posts published by user
        uint[] sellingPostsKeys;  // indexes of selling posts published by user
        PostResponseMessage[] responses; // all response messages belong to user
    }

    //constructor
    constructor(address _mainSystemAddress) {
        // initilize main system contract address
        mainSystemAddress = _mainSystemAddress;
        // initialize user testing data, allocate 100 units of electricity to test account
        address testAccount = 0x96c1CE80aB24e9Aa360c702A4026cAE725B0F31A;
        userMap[testAccount].availableElecUnits = 100;

    }

    function initializeContractAddresses(address _buyerServiceAddress, address _sellerServiceAddress, address _adminAddress) public {
        require(msg.sender == mainSystemAddress, "internal initialization function, access denied");
        // initialize buyer, seller service's contract address and admin address
        buyerServiceAddress = _buyerServiceAddress;
        sellerServiceAddress = _sellerServiceAddress;
        adminAddress = _adminAddress;
    }

    
    // getters 
    function getUsername(address _user) public view returns (string memory) {
        return userMap[_user].username;
    }

    function getAvailableElecUnits(address _user) public view returns (uint) {
        return userMap[_user].availableElecUnits;
    }

    function getPurchasePostKeys(address _user) public view returns (uint[] memory) {
        return userMap[_user].purchasePostKeys;
    }

    function getSellingPostKeys(address _user) public view returns (uint[] memory) {
        return userMap[_user].sellingPostsKeys;
    }

    // setters
    function setUsername(address _user, string memory _username) public {
        require(tx.origin == _user, "You cannot change other user's information");
        userMap[_user].username = _username;
    }   

    function setAvailableElecUnits(address _user, uint  _units) public {
        require(msg.sender == buyerServiceAddress || msg.sender == sellerServiceAddress, "access restricted to buyer/seller service, access denied");
        userMap[_user].availableElecUnits = _units;
    }

    function savePurchasePostKey(address _user, uint _purchasePostKey) public {
        require(msg.sender == buyerServiceAddress, "access denied");
        userMap[_user].purchasePostKeys.push(_purchasePostKey);
    }

    function saveSellingPostKey(address _user, uint _sellingPostKey) public {
        require(msg.sender == sellerServiceAddress, "access denied");
        userMap[_user].sellingPostsKeys.push(_sellingPostKey);
    }

    // update response messages
    function addResponse(address _user, PostResponseMessage message) public {
        userMap[_user].responses.push(message);
    }

    function returnAllResponses(address _user) public view returns (PostResponseMessage[] memory) {
        return userMap[_user].responses;
    }

    // add electricity by Admin
    function addAvailableElecUnits(address _user, uint  _units) public {
        require(tx.origin == adminAddress, "access restricted to Admin, access denied");
        require(_units > 0, "electricity units must be greater than 0");
        userMap[_user].availableElecUnits += _units;
    }

}
