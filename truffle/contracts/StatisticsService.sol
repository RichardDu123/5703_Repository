//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";
import "./BeanStructs.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";

contract StatisticsService is BeanStructs{

    mapping(address => Statistics) public userStatisticsMap;

    struct Statistics {
     
        uint totalBuy;           // storing total buy amount
        uint totalSell;          // storing total sell amount
        uint transactionCounter; // storing total transaction number
        
        // transaction creation time => transaction ETH value
        mapping(uint => uint)  electricityBuyTransactions; 
        uint[] electricityBuyKeys; // keep tracks of buy transaction time

        // transaction creation time => transaction ETH value
        mapping(uint => uint)  electricitySellTransactions; 
        uint[] electricitySellKeys; // keep tracks of sell transaction time

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
        address testAccount = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        // uint current = block.timestamp;
        uint Sep12 = 1662940800;
        uint Sep12_random = 1662940810;
        uint Sep13 = 1663027200;
        uint Sep14 = 1663113600;
        uint Sep15 = 1663200000;
        uint Sep15_random1 = 1663200010;
        uint Sep15_random2 = 1663200020;
        // uint Sep16 = 1663250400;
        uint Sep16_random = 1663286400;
        uint Sep17_random = 1663372800;
        uint Sep18_random1 = 1663459200;
        uint Sep18_random2 = 1663459210;
        uint Sep18_random3 = 1663459220;
        
        // expected weekly statistics startging from Sep 12: [10, 20, 30, 70, 40, 50, 60]
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep12] = 5;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep12_random] = 5;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep13] = 20;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep14] = 30;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep15] = 20;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep15_random1] = 40;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep15_random2] = 10;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep16_random] = 40;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep17_random] = 50;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep18_random1] = 20;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep18_random2] = 20;
        userStatisticsMap[testAccount].electricityBuyTransactions[Sep18_random3] = 20;

        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep12);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep12_random);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep13);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep14);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep15);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep15_random1);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep15_random2);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep16_random);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep17_random);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep18_random1);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep18_random2);
        userStatisticsMap[testAccount].electricityBuyKeys.push(Sep18_random3);

    }
    

    // ------------------------- functions to update statistics -------------------------

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

    // ------------------------- functions to return statistics -------------------------


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

    struct WeeklyBuyStatisticsInfo {
        uint totalWeekSkip;
        uint startDateTimestamp;
        uint endDateTimestamp;
        uint[] weeklyStatistics;
    }
    
    /*
        return weekly buy transactions statistics:
            _user: identify target user
            _txType:
                0: buy transaction
                1: sell transaction
            _prevWeekNum: identify which week's statistics to retrieve. Value starts from 0
                0: indicating current week
                1: previous week
                2: 2 weeks ago
                ...  
    */
    function returnWeeklyStatistics(address _user, uint _prevWeekNum, uint8 _txType) public view returns (uint[] memory) {
        require(_prevWeekNum >= 0, "week number starts from 0");
        // _prevWeekNum = 1;
        WeeklyBuyStatisticsInfo memory info;
        info.weeklyStatistics = new uint[](7);
        info.totalWeekSkip = 1 weeks * _prevWeekNum;
        
        // 2. get current day number of the week, and then convert it back to timestamp
        (uint _year, uint _month, uint _day) = BokkyPooBahsDateTimeLibrary.timestampToDate(block.timestamp); // 2022, 09, 25
        uint currentDateInTimestamp = BokkyPooBahsDateTimeLibrary.timestampFromDate(_year, _month, _day);    // current date in 00:00
        
        // 3. minus currentDateInTimestamp by (currentDayOfWeek - 1) to get the Monday timestamp of current week
        uint currentDayOfWeek = BokkyPooBahsDateTimeLibrary.getDayOfWeek(block.timestamp);                   // 7
        uint mondayOfCurrentWeekInTimestamp = currentDateInTimestamp - ((currentDayOfWeek - 1) * 1 days);    // Monday of current week
        
        // 4. minus mondayOfCurrentWeekInTimestamp by _totalWeekSkip to get the starting date of the weekly statistics in timestamp
        // e.g.  _totalWeekSkip is one week, then we will get last week's Monday timestamp
        info.startDateTimestamp = mondayOfCurrentWeekInTimestamp - info.totalWeekSkip;
        info.endDateTimestamp = info.startDateTimestamp + 1 weeks;
        
        // 5. iterate all buy transactions happen between start date and end date and accumulate data of the same day 
        uint[] memory keys;
        if (_txType == 0) {
            keys = userStatisticsMap[_user].electricityBuyKeys;
        } else if (_txType == 1) {
            keys = userStatisticsMap[_user].electricitySellKeys;
        } else {
            require(false, "invalid transaction type");
        }
        
        for (uint i = 0; i < keys.length; i++) {
            if ( keys[i] >= info.startDateTimestamp && keys[i] <= info.endDateTimestamp ) {
                uint _dayNum = BokkyPooBahsDateTimeLibrary.getDayOfWeek(keys[i]);
                info.weeklyStatistics[_dayNum - 1] += userStatisticsMap[_user].electricityBuyTransactions[keys[i]];
            }
        }
        return info.weeklyStatistics;
    }

    function returnWeeklyTotalBuyOrSell(address _user, uint _prevWeekNum, uint8 _txType) public view returns (uint) {
        uint[] memory weeklyStatistics = returnWeeklyStatistics(_user, _prevWeekNum, _txType);
        uint weeklyTotalSum = 0;
        for (uint i = 0; i < weeklyStatistics.length; i++) {
            weeklyTotalSum += weeklyStatistics[i];
        }
        return weeklyTotalSum;
    }
    

    // utils
    // function getDayOfWeek() public view returns (uint){
    //     return BokkyPooBahsDateTimeLibrary.getDayOfWeek(block.timestamp);
    // }

    // function timestampFromDate(uint _year,uint _month,uint _day) public view returns (uint){
    //     return BokkyPooBahsDateTimeLibrary.timestampFromDate(_year, _month, _day);
    // }

    
}