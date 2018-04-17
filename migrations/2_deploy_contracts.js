var Voting = artifacts.require("Voting")
var AuthenticateInfo = artifacts.require("AuthenticateInfo")

module.exports = function(deployer) {
  deployer.deploy(Voting);
  deployer.deploy(AuthenticateInfo);
}