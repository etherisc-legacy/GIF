pragma solidity >0.4.99 <0.6.0;

contract CustomOracleTypeLogic {

    constructor(
        //
    ) public {
        //
    }

    function isCustomOracleType() pure public returns(bool) { return(true); }

    function implementsOracleRegistration() pure public returns(bool) { return(false); }
    function validateOracleRegistration(
        address /* _oracleAddress */
    ) public view returns(bool) {
        return(true);
    }

    function implementsLoadBalancing() pure public returns(bool) { return(false); }

    function implementsRequestDeadlines() pure public returns(bool) { return(false); }
}
