import { takeLatest, put, all, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
  PAYMENT_TYPES,
  MAX_FLIGHT_DURATION,
  MIN_TIME_BEFORE_DEPARTURE,
  CONTRACT_DEAD_LINE,
  MIN_DEPARTURE_LIM,
  MAX_DEPARTURE_LIM,
} from 'shared/constants';
import moment from 'moment';
import errorHandler from 'shared/errorHandler';
import warningHandler from 'shared/warningHandler';
import * as appActions from 'modules/application/actions';
import * as apiActions from './actions';
import api from './api';
import CustomConfig from './../../shared/customConfig';


function* reqHealthCheck() {
  try {
    const data = yield api.healthCheck();
    yield put(appActions.setHealthCheck(data));
  } catch (err) {
    yield put(errorHandler(err));
  }
}

function* reqAirports() {
  try {
    const data = yield api.getAirports();
    yield put(appActions.setAirports(data));
  } catch (err) {
    yield put(errorHandler(err));
  }
}

function* reqSearchFlights(action) {
  const { origin, destination, date } = action.payload;

  yield put(apiActions.reqSearchFlightsStarted());

  try {
    const data = yield api.searchFlights(origin, destination, date);

    const flights = data.filter(flight => {
      const arrival = moment(flight.arrivalTime).unix();
      const departure = moment(flight.departureTime).unix();
      const dmy = moment(flight.departureTime).startOf('day').unix();

      if (
        arrival < departure
        || arrival > departure + MAX_FLIGHT_DURATION
        || departure < moment().unix() + MIN_TIME_BEFORE_DEPARTURE
        || departure > CONTRACT_DEAD_LINE
        || departure < dmy
        || departure > dmy + (24 * 60 * 60)
        || departure < MIN_DEPARTURE_LIM
        || departure > MAX_DEPARTURE_LIM
      ) {
        return false;
      }

      return true;
    });

    yield put(appActions.setSearchFlights(flights));
  } catch (err) {
    yield put(appActions.closeWizard());
    yield put(errorHandler(err));
  }
}

function* reqReservation(action) {
  const { reservationCode, firstname, lastname } = action.payload;

  try {
    const reservation = yield api.getReservation(reservationCode, firstname, lastname);
    const flightRating = yield api.getFlightRating(reservation.carrier, reservation.flightNumber);
    yield put(appActions.setReservation({ ...reservation, flightRating }));
  } catch (err) {
    yield put(errorHandler(err));
  }
}

function* reqFlightRating(action) {
  const { carrier, flightNumber } = action.payload;

  yield put(apiActions.reqFlightRatingStarted());

  try {
    const flightRating = yield api.getFlightRating(carrier, flightNumber);

    if (flightRating.observations && flightRating.observations >= 10) {
      // flightRating.arrivalAirportFsCode &&
      // (
      //   flightRating.arrivalAirportFsCode === 'ZRH' || flightRating.departureAirportFsCode === 'ZRH' ||
      //   flightRating.arrivalAirportFsCode === 'SFO' || flightRating.departureAirportFsCode === 'SFO' ||
      //   flightRating.arrivalAirportFsCode === 'OAK' || flightRating.departureAirportFsCode === 'OAK' ||
      //   flightRating.arrivalAirportFsCode === 'SJC' || flightRating.departureAirportFsCode === 'SJC'
      // )

      if (
        flightRating.arrivalAirportFsCode
      ) {
        yield put(appActions.setFlightRating({ flightRating }));
      } else {
        yield put(appActions.errorDialog({
          title: 'Checking flight info',
          message: 'insurance_not_available',
        }));
      }
    } else {
      yield put(appActions.errorDialog({
        title: 'Checking flight info',
        message: 'insurance_not_available',
      }));
    }
  } catch (err) {
    yield put(errorHandler(err));
  }
}

function* selectFlight(action) {
  yield put(appActions.setFlight({ ...action.payload }));

  const { arrivalTime, departureTime } = action.payload;

  const arrival = moment(arrivalTime).unix();
  const departure = moment(departureTime).unix();
  const dmy = moment(departureTime).startOf('day').unix();

  if (
    arrival < departure
    || arrival > departure + MAX_FLIGHT_DURATION
    || departure < moment().unix() + MIN_TIME_BEFORE_DEPARTURE
    || departure > CONTRACT_DEAD_LINE
    || departure < dmy
    || departure > dmy + (24 * 60 * 60)
    || departure < MIN_DEPARTURE_LIM
    || departure > MAX_DEPARTURE_LIM
  ) {
    yield put(appActions.errorDialog({
      title: 'Checking flight info',
      message: 'insurance_for_departure_not_available',
    }));
  } else {
    yield reqFlightRating(action);
  }
}

function* reqApplyForPolicyFiat(action) {
  const { createSource, couponCode } = action.payload;

  const { application } = yield select();

  yield put(apiActions.reqApplyForPolicyFiatStarted());

  try {
    const { source } = yield createSource({
      owner: {
        name: `${application.lastname} ${application.firstname}`,
        email: application.email,
      },
    });

    if (!source) {
      throw new Error('Please, specify card details');
    }

    if (source.status !== 'chargeable') {
      throw new Error('Your card is not chargeable');
    }

    const applyData = {
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      carrier: application.flight.carrier,
      flightNumber: application.flight.flightNumber,
      arrivesAt: application.flight.arrivalTime,
      departsAt: application.flight.departureTime,
      origin: application.flight.origin,
      destination: application.flight.destination,
      amount: application.policy.premium * 100,
      currency: PAYMENT_TYPES[Number(application.policy.currency)],
      stripeSourceId: source.id,
    };

    if (couponCode) {
      applyData.couponCode = couponCode;
    }

    const apply = yield api.applyForPolicyFiat(applyData);

    const {
      customerId, txHash,
    } = apply;

    yield put(appActions.reqCreatePolicyStarted({txHash}));
    const policy = yield api.createPolicy({txHash});

    if (!CustomConfig.workflow.waitTx) {
      yield put(appActions.reqCreatePolicyEnded());
      yield put(appActions.errorDialog({
        title: '',
        message: 'tx_timeout_details',
        details: {
          link: `${process.env.ETHERSCAN}/tx/${txHash}`
        },
      }));

      return;
    }

    const creation = yield api.waitPolicyCreation(txHash, 5000);

    if (creation.flowStatus === 'time_is_out') {
      yield put(appActions.reqCreatePolicyEnded());
      yield put(appActions.errorDialog({
        title: '',
        message: 'tx_timeout_details',
      }));

      return;
    }

    if (creation.flowError) {
      const flowError = JSON.parse(creation.flowError);

      if (flowError.type === 'DeclinedBySmartContract') {
        yield put(appActions.errorDialog({
          title: 'Transaction error has occurred',
          message: 'transaction_declined',
        }));
      }

      if (flowError.type === 'ChargeError') {
        yield put(appActions.errorDialog({
          title: 'Credit card error has occured',
          message: 'no_enough_money',
        }));
      }
    } else {
      yield put(apiActions.reqCustomerPolicies({ customerId }));
      yield put(appActions.policyApplied({
        ...creation,
        ...apply,
      }));
    }
  } catch (err) {
    yield put(apiActions.reqApplyForPolicyError());
    yield put(errorHandler(err));
  }
}

function* processApplicationFormSubmit({payload}) {
  yield put(appActions.setApplicationForm(payload));

  yield put(apiActions.reqSearchFlights({
    origin: payload.from.value,
    destination: payload.to.value,
    date: payload.date,
  }));
}

function* reqCustomerPolicies({payload}) {
  const { customerId } = payload;

  try {
    const policies = yield api.getCustomerPolicies(customerId);

    if (policies.length > 0) {
      yield put(appActions.setCustomerPolicies({ policies }));
    } else {
      yield put(warningHandler('no_policies_found'));
    }
  } catch (err) {
    yield put(errorHandler(err));
  }
}

function* reqCertificate({payload}) {
  const { certificateId } = payload;

  yield put(apiActions.reqCertificateStarted());
  try {
    const certificate = yield api.getCertificate(certificateId);

    yield put(appActions.setMyCertificate(certificate));
  } catch (err) {
    if (err instanceof URIError) {
      yield put(push('/404'));
    } else {
      yield put(errorHandler(err));
    }
  }
}

function* reqCheckCoupon({payload}) {
  let couponCode = null;
  if (payload.couponCode) {
    couponCode = yield api.getCoupon(payload.couponCode, payload.date);
  }
  yield put(appActions.setCoupon({couponCode}));
}

function* reqScheduleFields({payload}) {
  const fields = yield api.getScheduleFields(payload);

  yield put(appActions.setScheduleFields(fields));
}

function* apiRequestsWatcher() {
  yield all([
    takeLatest(apiActions.reqHealthCheck, reqHealthCheck),
    takeLatest(apiActions.reqAirports, reqAirports),
    takeLatest(apiActions.reqSearchFlights, reqSearchFlights),
    takeLatest(apiActions.reqReservation, reqReservation),
    takeLatest(apiActions.reqFlightRating, reqFlightRating),
    takeLatest(apiActions.reqApplyForPolicyFiat, reqApplyForPolicyFiat),
    takeLatest(appActions.selectFlight, selectFlight),
    takeLatest(appActions.submitApplicationForm, processApplicationFormSubmit),
    takeLatest(apiActions.reqCustomerPolicies, reqCustomerPolicies),
    takeLatest(apiActions.reqCertificate, reqCertificate),
    takeLatest(apiActions.checkCoupon, reqCheckCoupon),
    takeLatest(apiActions.reqScheduleFields, reqScheduleFields),
  ]);
}

export default apiRequestsWatcher;
