const Byetx = artifacts.require("Byetx");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
.use(require("chai-as-promised"))
.should()

contract("DecentralBank",([owner,customer]) => {
    let byetx,rwd,decentralBank
    function tokens(number) {
        return web3.utils.toWei(number,"ether")
    }
    before(async ()=>{
        byetx = await Byetx.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address,byetx.address)
        
        // Transfering RWD tokens to smart contract address("Decentral Bank")
        await rwd.transfer (decentralBank.address,tokens("1000000")) 
        // Transfering 100 Bytex tokens to an investor when signing up
        await byetx.transfer(customer,tokens("100"),{from: owner})  


    })
    describe("Mock Byetx Deployment",async()=>{
        it("Macthes the name successfully",async()=>{
            const name = await byetx.name()
            assert.equal(name,"Byetx")
        })
    })
    describe("Mock Byetx Deployment",async()=>{
        it("Macthes the name successfully",async()=>{
            const symbol = await byetx.symbol()
            assert.equal(symbol,"Byet")
        })
    })
    describe("Mock Byetx Deployment",async()=>{
        it("Macthes the name successfully",async()=>{  
            const supply = await byetx.totalSupply()
            assert.equal(supply,16000000000000000000000000)
        })
    })
    describe("Mock RWD Deployment",async()=>{
        it("Macthes the name successfully",async()=>{
            const name = await rwd.name()
            assert.equal(name,"Reward Token")
        })
    })
    describe("Mock RWD Deployment",async()=>{
        it("Macthes the name successfully",async()=>{
            const symbol = await rwd.symbol()
            assert.equal(symbol,"RWD")
        })
    })
    describe("Mock RWD Deployment",async()=>{
        it("Macthes the name successfully",async()=>{
            const supply = await rwd.totalSupply()
            assert.equal(supply,16000000000000000000000000)
        })
    })
    describe("Mock Decentral Bank Deployment",async()=>{
        it("Macthes the name successfully",async()=>{
            const name = await decentralBank.name()
            assert.equal(name,"Decentral Bank")
        })
        it("contract has tokens",async () =>{
            let balance = await rwd.balanceof(decentralBank.address)
            assert.equal(balance,tokens("1000000"))
        })
    })
})