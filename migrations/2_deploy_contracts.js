const Byetx = artifacts.require("Byetx");
module.exports = async function (deployer){
    await deployer.deploy(Byetx)
};
