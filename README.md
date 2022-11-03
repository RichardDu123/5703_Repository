# G3_CS34 \_COMP5703

## Deploy the smart contract on the private blockchain

```sh
# Install Truffle globally`
$ npm install -g truffle
```

```sh
#test on port 7545
open ganache software and start a private blockchain
$ cd truffle
$ npm install
# deploy contracts on the ganache
$ truffle migrate
```

## Start the client dev server

Edit the .env file in the client folder and changed the admin address (The smart contract creator address) and then:

```sh
$ cd client
$ yarn install
# Starting the development server...
$ yarn serve
```

Make sure you install the MetaMask
