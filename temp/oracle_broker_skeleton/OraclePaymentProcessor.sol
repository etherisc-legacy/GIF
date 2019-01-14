pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerBackend

contract OraclePaymentProcessor is OracleBrokerBackend {

    mapping ( address => uint ) public oracleStakes; // TODO: Maybe add OracleStakesLedger contract

    enum PaymentStatus { Stored, Refunded, PaidOut }
    struct Payment {
        PaymentStatus status,
        uint amount,
        address payer,
        // address ERC20 Token Address ?
    }

    mapping ( bytes32 => Payment ) public requestPayments; // TODO: add ledger

    function transfer(
        address fromAccount,
        address toAccount,
        uint amount
    ) internal {
        // TODO transfer funds
    }

    function acceptOracleStake(
        address _oracleAccount,
        uint _amount
    ) public onlyBrokerFront {
        transfer(_oracleAccount, platformAccount, amount);  // TODO: read platform Account from somewhere
        oracleStakes[_oracleAccount] = _amount;
    }

    function refundOracleStake(
        address _oracleAccount,
    ) public onlyBrokerFront {
        transfer(
            platformAccount,
            _oracleAccount,
            oracleStakes[_oracleAccount]
        );  // TODO: read platform Account from somewhere
        oracleStakes[_oracleAccount] = 0;
    }

    function getOracleStake(
        address _oracleAccount
    ) public onlyBrokerFront returns(uint) {
        return oracleStakes[_oracleAccount];
    }

    function cutOracleStake(
        address _oracleAccount,
        uint _cutAmount,
    ) public onlyBrokerFront returns(uint) {
        oracleStakes[_oracleAccount] = oracleStakes[_oracleAccount] - _cutAmount;
    }

    function storeRequestPayment(address productContract, bytes32 _requestId, uint _amount) public {
        Payment memory newPayment = Payment({ amount: _amount, payer: productContract })
        transfer(
            paymentAccount(productContract), // TODO: add lookup
            platformAccount,        //
            _amount,
        );
        requestPayment[_requestId] = amount;
    }

    function commitRequestPayment(bytes32 _requestId, address oracleAddres) public {
        Payment memory payment = requestPayment[_requestId];

        require(payment.status == Stored);

        transfer(
            platformAccount,        //
            paymentAccount(oracleAddres), // TODO: add lookup
            payment.amount,
        );

        payment.status = PaidOut; // TODO: Need better way to indicate payment success
    }

    function refundRequestPayment(bytes32 _requestId) public {
        Payment memory payment = requestPayment[_requestId];

        require(payment.status == Stored);

        transfer(
            platformAccount,        //
            payment.payer,
            payment.amount,
        );

        payment.status = Refunded; // TODO: Need better way to indicate payment success
    }
}
