import { handleActions } from 'redux-actions';
import * as actions from './actions';
import * as apiActions from '../api/actions';

const reducer = handleActions({
  [actions.setHealthCheck]: (state, action) => ({...state, ...action}),

  [actions.setAirports]: (state, action) => ({...state, ...action}),

  [actions.closeWizard]: state => ({
    customer: state.customer,
    isShowingWizard: false,
    currentWizardView: state.currentWizardView,
    flight: {},
    flightSearch: {},
    steps: [],
    policy: {
      payouts: {},
    },
    error: {},
  }),

  [actions.showPrivacy]: state => ({ ...state, isShowingPrivacy: true }),

  [actions.closePrivacy]: state => ({ ...state, isShowingPrivacy: false }),

  [actions.showTerms]: state => ({ ...state, isShowingTerms: true }),

  [actions.closeTerms]: state => ({ ...state, isShowingTerms: false }),

  [actions.showInfo]: state => ({ ...state, isShowingInfo: true }),

  [actions.closeInfo]: state => ({ ...state, isShowingInfo: false }),

  [actions.showTxInfo]: state => ({ ...state, isShowingTxInfo: true }),

  [actions.closeTxInfo]: state => ({ ...state, isShowingTxInfo: false }),

  [actions.setFlightRating]: (state, action) => ({...state, ...action}),

  [actions.setReservation]: (state, action) =>
    ({ ...state, flight: action.payload, isShowingWizard: true }),

  [actions.setCustomer]: (state, action) => ({ ...state, customer: action.payload }),

  [apiActions.reqSearchFlightsStarted]: (state) =>
    ({ ...state, flightSearch: { isSearching: true } }),

  [actions.setSearchFlights]: (state, action) =>
    ({...state, flightSearch: { flights: [...action.payload], error: null, isSearching: false }}),

  [actions.setFlight]: (state, action) =>
    ({
      ...state,
      flight: { ...state.flight, ...action.payload },
      flightSearch: { ...state.flightSearch, selected: action.payload.id },
    }),

  [apiActions.reqFlightRatingStarted]: (state) =>
    ({ ...state, flight: { ...state.flight, isRatingRequest: true } }),

  [apiActions.reqApplyForPolicyFiatStarted]: state =>
    ({
      ...state,
      policy: { ...state.policy, isApplyRequest: true },
    }),

  [apiActions.reqApplyForPolicyError]: state =>
    ({ ...state, policy: { ...state.policy, isApplyRequest: false }}),

  [actions.reqCreatePolicyStarted]: (state, action) => ({
    ...state,
    policy: {
      ...state.policy,
      isApplyRequest: false,
      isCreatePolicyRequest: true,
      txHash: action.payload.txHash,
    },
  }),

  [actions.reqCreatePolicyEnded]: state => ({
    ...state,
    policy: {
      ...state.polocy,
      isCreatePolicyRequest: false,
    },
  }),

  [actions.applyPolicyEthStarted]: state => ({
    ...state,
    policy: {
      ...state.policy,
      isApplyPolicyEthReq: true,
    },
  }),

  [actions.createPolicyEthStarted]: (state, action) => ({
    ...state,
    policy: {
      ...state.policy,
      isApplyPolicyEthReq: false,
      isCreatePolicyEthReq: true,
      txHash: action.payload.txHash,
    },
  }),

  [actions.backTo]: (state, action) => ({...state, currentWizardView: action.payload.view}),

  [actions.selectEth]: state =>
    ({
      ...state,
      steps: [
        { view: 'searchFlights', available: true },
        { view: 'policyTable', available: false },
      ],
    }),

  [actions.selectFiat]: state =>
    ({
      ...state,
      steps: [
        { view: 'searchFlights', available: true },
        { view: 'policyTable', available: false },
        { view: 'cardDetails', available: false },
      ],
    }),

  [actions.setCurrentWizardView]: (state, action) =>
    ({ ...state, currentWizardView: action.payload.view }),

  [actions.setApplicationForm]: (state, action) =>
    ({
      ...state,
      ...action.payload,
      isShowingWizard: true,
      currentWizardView: 'searchFlights',
      steps: [
        { view: 'searchFlights', available: true },
        { view: 'policyTable', available: false },
      ],
    }),

  [actions.errorDialog]: (state, action) =>
    ({
      ...state,
      currentWizardView: 'errorDialog',
      error: { ...action.payload },
    }),

  [actions.setFlightRating]: (state, action) =>
    ({
      ...state,
      flight: {
        ...state.flight,
        ...action.payload,
        isRatingRequest: false,
      },
      flightSearch: { ...state.flightSearch, selected: false },
      currentWizardView: 'policyTable',
      steps: [
        { view: 'searchFlights', available: true},
        { view: 'policyTable', available: true},
      ],
    }),

  [actions.setPolicyTableFiat]: (state, action) =>
    ({
      ...state,
      policy: {...action.payload},
      currentWizardView: 'cardDetails',
      steps: [
        { view: 'searchFlights', available: true},
        { view: 'policyTable', available: true },
        { view: 'cardDetails', available: true },
      ],
    }),

  [actions.policyApplied]: (state, action) =>
    ({
      ...state,
      policy: {
        ...state.policy,
        ...action.payload,
        isApplyRequest: false,
        isCreatePolicyEthReq: false,
        isCreatePolicyRequest: false,
        isApplyPolicyEthReq: false,
      },
      currentWizardView: 'policyApplied',
      steps: [
        { view: 'searchFlights', available: false },
        { view: 'policyTable', available: false },
        { view: 'cardDetails', available: false },
      ],
    }),

  [actions.showCertificate]: state =>
    ({
      ...state,
      currentWizardView: 'certificate',
    }),

  [actions.showTermsInWizard]: state => ({...state, currentWizardView: 'terms'}),

  [actions.setCustomerPolicies]: (state, action) => ({
    ...state,
    customer: {
      policies: [...action.payload.policies],
    },
  }),

  [actions.showRedirectModal]: (state, action) => ({
    ...state,
    showRedirectModal: true,
    redirectTo: action.payload.link,
  }),

  [actions.closeRedirectModal]: (state) => ({
    ...state,
    showRedirectModal: false,
    redirectTo: null,
  }),

  [actions.setMyCertificate]: (state, action) => ({
    ...state,
    myCertificate: {...action.payload},
  }),

  [actions.setCoupon]: (state, action) => ({
    ...state,
    policy: {
      ...state.policy,
      couponCode: { ...action.payload.couponCode },
    },
  }),

  [actions.setScheduleFields]: (state, action) => ({
    ...state,
    scheduleFields: {
      ...action.payload,
    },
  }),
}, {
  customer: {
    customerId: '',
    policies: [],
  },
  policy: {},
  flightSearch: {},
  flight: {},
  wizard: {
    steps: [],
    current: '',
  },
});

export default reducer;
