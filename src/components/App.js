import React,{Component} from "react";
import Navbar from "./Navbar";
import "./App.css";
import Web3 from "web3";
import Byetx from "../truffle_abis/Byetx.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";

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
            let bytexBalance = await byetx.methods.balanceof(this.state.account).call()
            this.setState({bytexBalance: bytexBalance.toString()})
            console.log({byetxbalance: bytexBalance})
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
        this.setState({loading: false})
    }

    constructor(props){
        super(props)
        this.state = {
            account:"0x0",
            byetx: {},
            rwd:{},
            decentralBank:{},
            bytexBalance: "0",
            rwdBalance: "0",
            stakingBalance: "0",
            loading:true
        }
    }
    render(){
        return (
            <div>
                <Navbar account={this.state.account}></Navbar>
                <h1>{console.log(this.state.loading)}</h1>
            </div>
        )
    }
}
export default App;