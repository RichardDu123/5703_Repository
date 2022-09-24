//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";
import "./BeanStructs.sol";

contract StatisticsService is BeanStructs{

    mapping(address => Statistics) public userStatisticsMap;

    struct Statistics {
     
        uint totalBuy;           // storing total buy amount
        uint totalSell;          // storing total sell amount
        uint transactionCounter; // storing total transaction number
        
        // transaction creation time => transaction ETH value
        mapping(uint => uint)  electricityBuyTransactions; 
        uint[] electricityBuyKeys;

        // transaction creation time => transaction ETH value
        mapping(uint => uint)  electricitySellTransactions; 
        uint[] electricitySellKeys;

        // storing all transactions in sequence
        mapping(uint => TxSequenceUnit)  transactionSequenceMap; 

    }

    struct TxSequenceUnit {
        uint transactionType; // buyTransaction - 0; sellTransaction - 1
        uint transactionTime;  // key to transaction mappings
    }


    // ------------------------- constructor -------------------------
    constructor() {
        //TO-DO: insert dummy data for test purpose
    }
    

    // ------------------------- utils to update statistics -------------------------

    function updateTotalBuy(address _user, uint _addVal) public {
        // require(msg.sender == mainSystem, "access denied");
        userStatisticsMap[_user].totalBuy += _addVal;
    }

    function updateTotalSell(address _user, uint _addVal) public {
        // require(msg.sender == mainSystem, "access denied");
        userStatisticsMap[_user].totalSell += _addVal;
    }

    function addOneElectricBuyTransaction(address _user, uint _transactionTime, uint _transactionAmount) public {
        // require(msg.sender == mainSystem, "access denied");
        userStatisticsMap[_user].electricityBuyTransactions[_transactionTime] = _transactionAmount;
        userStatisticsMap[_user].electricityBuyKeys.push(_transactionTime);
    }

    function addOneElectricSellTransaction(address _user, uint _transactionTime, uint _transactionAmount) public {
        // require(msg.sender == mainSystem, "access denied");
        userStatisticsMap[_user].electricitySellTransactions[_transactionTime] = _transactionAmount;
        userStatisticsMap[_user].electricitySellKeys.push(_transactionTime);
    }

    function addTransactionToSequenceMap(address _user, uint _transactionType, uint _transactionTime) public {
        uint count = userStatisticsMap[_user].transactionCounter;
        userStatisticsMap[_user].transactionSequenceMap[count].transactionType = _transactionType;
        userStatisticsMap[_user].transactionSequenceMap[count].transactionTime = _transactionTime;
        userStatisticsMap[_user].transactionCounter++;
    }

    // ------------------------- utils to return statistics -------------------------


    function returnTotalBuyByAddress(address _accountAdress) public view returns (uint) {
        return userStatisticsMap[_accountAdress].totalBuy;
    }

    function returnTotalSellByAddress(address _accountAdress) public view returns (uint) {
        return userStatisticsMap[_accountAdress].totalSell;
    }

    // return 10 recent transactions (return all if transactions if total amount is less than 10)
    function returnRecentTransactions(address _account) public view returns (TransactionBean[] memory)  {
        uint _size = userStatisticsMap[_account].transactionCounter;
        uint j = 0;
        if (_size > 0) {
            j = _size - 1;
        }
        TransactionBean[] memory transactionBeans = new TransactionBean[](min(_size, 10));
        // transactionBeans[0].createdAt = 1;
        // transactionBeans[0].transactionType = 1;
        // transactionBeans[0].transactionValue = 1;
        for (uint i = 0; i < min(_size, 10); i++) {
            transactionBeans[i].createdAt = userStatisticsMap[_account].transactionSequenceMap[j].transactionTime;
            transactionBeans[i].transactionType = userStatisticsMap[_account].transactionSequenceMap[j].transactionType;
            if (transactionBeans[i].transactionType == 0) {
                transactionBeans[i].transactionValue =  userStatisticsMap[_account].electricityBuyTransactions[transactionBeans[i].createdAt];
            } else {
                transactionBeans[i].transactionValue =  userStatisticsMap[_account].electricitySellTransactions[transactionBeans[i].createdAt];
            }
            if (j > 0) {
                j--;
            }
        }

        return transactionBeans;
    }

    function min(uint a, uint b) internal pure returns(uint) {
        if (a < b) {
            return a;
        }
        return b;
    }

    // TO-DO
    // function returnWeeklyBuy() public view returns (WeeklyBuyBean[] memory) {

    // }

    // TO-DO
    // function returnWeeklySell() public view returns () {

    // }

    
}