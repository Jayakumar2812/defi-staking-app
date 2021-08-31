pragma solidity ^0.8.0 ;

import "./RWD.sol";
import "./Byetx.sol";
contract DecentralBank{
    string public name = "Decentral Bank";
    address public owner;
    mapping(address => uint) public stakingBalance;
    Byetx public byetx;
    RWD public rwd;
    constructor(RWD _rwd, Byetx _byetx){
        rwd= _rwd;
        byetx= _byetx;
    }
    function depositToken(uint _amount) public{
        byetx.transferFrom(msg.sender,address(this),_amount);

    }
}