import { createAction } from 'redux-actions';

export const setHealthCheck = createAction('@APP/SET_HEALTH_CHECK');
export const setAirports = createAction('@APP/SET_AIRPORTS');
export const setSearchFlights = createAction('@APP/SET_SEARCH_FLIGHTS');
export const setReservation = createAction('@APP/SET_RESERVATION');
export const setFlight = createAction('@APP/SET_FLIGHT');
export const setFlightRating = createAction('@APP/SET_FLIGHT_RATING');
export const setCustomer = createAction('@APP/SET_CUSTOMER');


export const closeWizard = createAction('@APP/CLOSE_WIZARD');
export const showTerms = createAction('@APP/SHOW_TERMS');
export const closeTerms = createAction('@APP/CLOSE_TERMS');
export const showPrivacy = createAction('@APP/SHOW_PRIVACY');
export const closePrivacy = createAction('@APP/CLOSE_PRIVACY');
export const showInfo = createAction('@APP/SHOW_INFO');
export const closeInfo = createAction('@APP/CLOSE_INFO');
export const showTxInfo = createAction('@APP/SHOW_TX_INFO');
export const closeTxInfo = createAction('@APP/CLOSE_TX_INFO');

export const submitApplicationForm = createAction('@APP/SUBMIT_APPLICATION_FORM');
export const setApplicationForm = createAction('@APP/SET_APPLICATION_FORM');

export const selectFlight = createAction('@APP/SELECT_FLIGHT');

export const submitPolicyTable = createAction('@APP/SUBMIT_POLICY_TABLE');
export const setPolicyTableFiat = createAction('@APP/SET_POLICY_TABLE');

export const policyApplied = createAction('@APP/POLICY_APPLIED');

export const showCertificate = createAction('@APP/SHOW_CERTIFICATE');

export const showTermsInWizard = createAction('@APP/SHOW_TERMS_IN_WIZARD');

export const backTo = createAction('@APP/SHOW_TERMS_IN_WIZARD');

export const setCurrentWizardView = createAction('@APP/SET_CURRENT_WIZARD_VIEW');

export const selectEth = createAction('@APP/SELECT_ETH');
export const selectFiat = createAction('@APP/SELECT_FIAT');

export const setCustomerPolicies = createAction('@APP/SET_CUSTOMER_POLICIES');

export const showRedirectModal = createAction('@APP/SHOW_REDIRECT_MODAL');
export const closeRedirectModal = createAction('@APP/CLOSE_REDIRECT_MODAL');

export const setMyCertificate = createAction('@APP/SET_MY_CERTIFICATE');

export const reqCreatePolicyStarted = createAction('@APP/REQ_CREATE_POLICY_STARTED');
export const reqCreatePolicyEnded = createAction('@APP/REQ_CREATE_POLICY_ENDED');

export const applyPolicyEthStarted = createAction('@APP/REQ_APPLY_POLICY_ETH_STARTED');
export const createPolicyEthStarted = createAction('@APP/REQ_CREATE_POLICY_ETH_STARTED');

export const errorDialog = createAction('@APP/ERROR_DIALOG');

export const setCoupon = createAction('@APP/SET_COUPON');

export const setScheduleFields = createAction('@APP/SET_SCHEDULE_FIELDS');
