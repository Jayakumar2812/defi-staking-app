const Byetx = artifacts.require("Byetx");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");
module.exports = async function (deployer, network,accounts){
    await deployer.deploy(Byetx)
    const byetx = await Byetx.deployed()
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()
    await deployer.deploy(DecentralBank, rwd.address, byetx.address)
    const decentralBank = await DecentralBank.deployed()

    await rwd.transfer(decentralBank.address,"16000000000000000000000000")
    
    await byetx.transfer(accounts[1],"200000000000000000000")

};
