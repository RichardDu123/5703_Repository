const contract = artifacts.require("MainSystem")

module.exports = function (deployer) {
  deployer.deploy(contract)
}
