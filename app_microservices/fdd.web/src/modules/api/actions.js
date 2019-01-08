import { createAction } from 'redux-actions';

export const reqHealthCheck = createAction('@API/REQ_HEALTH_CHECK');
export const reqAirports = createAction('@API/REQ_AIRPORTS');

export const reqReservation = createAction('@API/REQ_RESERVATION');

export const reqApplyForPolicyFiatStarted = createAction('@API/REQ_APPLY_FOR_POLICY_FIAT_STARTED');
export const reqApplyForPolicyError = createAction('@API/REQ_APPLY_FOR_POLICY_ERROR');
export const reqApplyForPolicyFiat = createAction('@API/APPLY_FOR_POLICY_FIAT');

export const reqSearchFlightsStarted = createAction('@API/REQ_SEARCH_FLIGHTS_STARTED');
export const reqSearchFlights = createAction('@API/REQ_SEARCH_FLIGHTS');

export const reqFlightRatingStarted = createAction('@API/REQ_FLIGHT_RATING_STARTED');
export const reqFlightRating = createAction('@API/REQ_FLIGHT_RATING');

export const reqCustomerPolicies = createAction('@API/REQ_CUSTOMER_POLICIES');

export const reqCertificate = createAction('@API/REQ_CERTIFICATE');
export const reqCertificateStarted = createAction('@API/REQ_CERTIFICATE_STARTED');

export const checkCoupon = createAction('@API/CHECK_COUPON');

export const reqScheduleFields = createAction('@API/REQ_SCHEDULE_FIELDS');
