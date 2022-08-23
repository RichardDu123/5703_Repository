const contract = artifacts.require("ItemManager");

module.exports = function (deployer) {
  deployer.deploy(contract);
};
