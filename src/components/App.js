import React,{Component} from "react";
import Navbar from "./Navbar";
import "./App.css";
import Web3 from "web3";
import Byetx from "../truffle_abis/Byetx.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import Main from "./Main"

class App extends Component{

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockChainData()
    }

    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } 
        else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)  
        }
        else{
            window.alert("N0 ethereum browser detected! Check out Metamask!")
        }
    }
    async loadBlockChainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account:account[0]})
        const networkId = await web3.eth.net.getId()
        
        // Byetx contract
        const byetxData = Byetx.networks[networkId]
        if(byetxData){
            const byetx = new web3.eth.Contract(Byetx.abi,byetxData.address)
            this.setState({byetx})
            let byetxBalance = await byetx.methods.balanceof(this.state.account).call()
            this.setState({byetxBalance: byetxBalance.toString()})
            console.log({byetxbalance: byetxBalance})
        }
        else{
            window.alert("Error! Byetx contract not deployed - network not detected!")
        }
        const rwdData = RWD.networks[networkId]
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi,rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceof(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString()})
        }
        else{
            window.alert("Error! RWD contract not deployed - network not detected!")
        }
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData){
            const decentralBank = new web3.eth.Contract(DecentralBank.abi,decentralBankData.address)
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: stakingBalance.toString()})
        }
        else{
            window.alert("Error! DecentralBank contract not deployed - network not detected!")
        }
        this.setState({loading:false})
    }
    //staking-tranferfrom-approval-depositTokens(send(transactionHash))
    //staking function
    stakeTokens = (amount) =>{
        this.setState({loading:true})
        this.state.byetx.methods.approve(this.state.decentralBank._address,amount).send({from:this.state.account}).on("transactionHash",(hash) =>{
        this.state.decentralBank.methods.depositTokens(amount).send({from:this.state.account}).on("transactionHash",(hash) =>{
            this.setState({loading:false})
        })
    })
    }
    // unstaking function
    unstakingTokens = () =>{
        this.setState({loading:true})
        this.state.decentralBank.methods.unstakeTokens().send({from:this.state.account}).on("transactionHash",(hash) =>{
            this.setState({loading:false})
        
    })
    }
    issueTokens = () =>{
        this.setState({loading:true})
        this.state.decentralBank.methods.issueTokens().send({from:this.state.account}).on("transactionHash",(hash) =>{
            this.setState({loading:false})
        
    })
    }
    constructor(props){
        super(props)
        this.state = {
            account:"0x0",
            byetx: {},
            rwd:{},
            decentralBank:{},
            byetxBalance: "0",
            rwdBalance: "0",
            stakingBalance: "0",
            loading:true
        }
    }
    render(){
        let content
        {this.state.loading ? content =
        <p id="loader" className="text-center" style={{margin:"30px"}}>
            LOADING PLEASE WAIT...
        </p> : 
        content = <Main 
        byetxBalance = {this.state.byetxBalance}
        rwdBalance = {this.state.rwdBalance}
        stakingBalance= {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakingTokens}
        issueTokens = {this.issueTokens}
        />}
        return (
            <div>
                <Navbar account={this.state.account}></Navbar>
                <h1>{console.log(this.state.loading)}</h1>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:"600px",minHeight:"100vm"}}>
                            <div>
                               {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}
export default App;