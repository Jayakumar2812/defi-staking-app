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
    describe("Yield Farming",async ()=>{
        it("reward tokens for staking",async() =>{
            let result
            // Checking Investor Balance
            result = await byetx.balanceof(customer)
            assert.equal(result.toString(),tokens("100"),"Customer mock wallet before staking balance")
     
        // Check Staking For Customer of 100 tokens
        await byetx.approve(decentralBank.address,tokens("100"), {from : customer})
        await decentralBank.depositTokens(tokens("100"),{from:customer})
        // check updated balance of customer
        result = await byetx.balanceof(customer)
        assert.equal(result.toString(),tokens("0"),"Customer mock wallet after staking 100 tokens balance")
        //check updated balance of decentralBank
        result = await byetx.balanceof(decentralBank.address)
        assert.equal(result.toString(),tokens("100"),"decentral Bank wallet after customer has staked")

        // check updated status whether isStaking is true
        result = await decentralBank.isStaking(customer)
        assert.equal(result.toString(),"true","cutomer staking status to be true")
        
        //Issue Tokens
        await decentralBank.issueTokens({from: owner})
        //Ensure only the owner can Issue Tokens
        await decentralBank.issueTokens({from:customer}).should.be.rejected;
        //unstaked Tokens
        await decentralBank.unstakeTokens({from:customer})
        // Check unstaking Balances
        result = await byetx.balanceof(customer)
        assert.equal(result.toString(),tokens("100"),"Customer mock wallet after unstaking 100 tokens balance")
        //check updated balance of decentralBank
        result = await byetx.balanceof(decentralBank.address)
        assert.equal(result.toString(),tokens("0"),"decentral Bank wallet after customer has staked")

        // check updated status whether isStaking is true
        result = await decentralBank.isStaking(customer)
        assert.equal(result.toString(),"false","cutomer is no longer staking status after unstaking")
        })
    })
    })
})