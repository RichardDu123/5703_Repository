智能合约结构示意图
[![xA0Qv4.png](https://s1.ax1x.com/2022/09/24/xA0Qv4.png)](https://imgse.com/i/xA0Qv4)

### Backend API Spec

#### 1.Basic Module

内部使用



#### 2. Buyer module

##### 2.1 buyer: create a new purchase post 买方创建新的采购帖

`createPurchasePost (uint _priceToBuy, uint _amountToBuy)`

Request parameter

- _priceToBuy: 单位购买价格
- _amountToBuy : 购买数量

##### 2.2 seller: create purchase post response messages 卖方创建回复采购公告的讯息

  `function createResponseMessageToPurchasePost(uint _amountToSell, uint _quotationInWei, uint _purchasePostKey)`

- _amountToSell：卖方想卖出多少单元的电
- _quotationInWei：卖方预期的单位售卖价格
- _purchasePostKey：表明该回复讯息是回复给哪个采购帖

##### 2.3 system: handle payment processes from response message 

  `function triggerPayment(uint _purchasePostKey, uint _responseMessageIndex)`

注：该方法由 PostResponseMessage 实例的receive() 方法内部调用



#### 3. Seller module

##### 3.1 seller -  create a new selling post 卖方创建新的售卖帖

`function createSellingPost (uint _priceToSell, uint _amountToSell)`

- _priceToSell: 单位售卖价格
- _amountToSell : 售卖数量

##### 3.2 buyer - create selling post response messages 买方创建回复售卖公告的讯息

  `function createResponseMessageToSellingPost(uint _amountToBuy, uint _quotationInWei, uint _sellingPostKey)`

  buyer creates response message and wait for confirmation from seller. buyer then pays for it once response is accepted

- _amountToBuy：买方想买多少单元的电
- _quotationInWei：买方预期的单位购买价格
- _sellingPostKey：表明该回复讯息是回复给哪个售卖帖

##### 3.3 handle payment processes from response message 

`function handleSellingPostPayment(uint _sellingPostKey, uint _responseMessageIndex)`

注：该方法由 PostResponseMessage 实例的receive() 方法内部调用



#### 4. Main System

包含各种utils，主要用于返回特定数据

#### 5. PostResponseMessage

`setIsAccepted(bool _isAccepted)`

设置回复讯息的状态，如果买方或卖方accpet特定的回复讯息，调用此函数更新讯息状态

默认 isAccpeted 为 false，此时无法进行支付操作，只有在  isAccpeted 更新为true后才能进行支付
