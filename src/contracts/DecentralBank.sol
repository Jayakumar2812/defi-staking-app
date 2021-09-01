pragma solidity ^0.8.0 ;

import "./RWD.sol";
import "./Byetx.sol";
contract DecentralBank{
    string public name = "Decentral Bank";
    address public owner;
    Byetx public byetx;
    RWD public rwd;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool )public hasStaked;
    mapping(address => bool )public isStaking;
    
    constructor(RWD _rwd, Byetx _byetx){
        rwd= _rwd;
        byetx= _byetx;
        owner = msg.sender;
    }
    function depositTokens(uint _amount) public{
        // require staking amount to be grater than 0
        require(_amount >0,"Amount cannot be 0 ");
        // Transfer Bytex tokens to this contract address for staking
        byetx.transferFrom(msg.sender,address(this),_amount);
        // Updating staking Balance 
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        } 
        // Updating staking Boolean 
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true; 
    }
    // Unstaking token Balance
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0,"staking Balance cannot be 0");
        // transfer the tokens to the specified contract address from our bank
        byetx.transfer(msg.sender,balance);
        // resetting staking balance 
        stakingBalance[msg.sender] = 0;
        //update Staking status
        isStaking[msg.sender] = false; 
    }
    // issue rewards
    function issueTokens() public {
        // require the owner to issue tokens only 
        require(msg.sender == owner,"caller must be the owner");
        for (uint i =0; i<stakers.length;i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient]/20; //Incentive for stakers 
            if(balance > 0){
            rwd.transfer(recipient,balance);
            }
        }
    }
}