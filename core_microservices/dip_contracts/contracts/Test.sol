pragma solidity >0.4.99 <0.6.0;

contract Test {

    event E1(address indexed sender, uint indexed value);

    constructor() public {
        AddEvent();
    }

    function AddEvent() public payable {
        emit E1(msg.sender, msg.value);
    }

    function Suicide() public {
        selfdestruct(msg.sender);
    }
}
