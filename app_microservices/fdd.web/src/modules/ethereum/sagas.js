import { takeLatest, put, all, select } from 'redux-saga/effects';
import moment from 'moment';
import errorHandler from 'shared/errorHandler';
import { PAYMENT_TYPES } from 'shared/constants';
import api from 'modules/api/api';
import * as apiActions from 'modules/api/actions';
import * as appActions from 'modules/application/actions';
import * as ethActions from './actions';
import { getNetwork, applyForPolicy, toWei } from './web3calls';

function* requestNetworkData() {
  try {
    const networkData = yield getNetwork();

    yield put(ethActions.setNetworkData(networkData));
  } catch (err) {
    yield put(errorHandler(err));
  }
}

function* processPolicyTableSubmit(action) {
  const { currency, premium, coupon, date } = action.payload;

  if (currency === '0') {
    if (!window.web3) {
      yield put(errorHandler({message: 'You should have Ethereum provider to pay in ETH. Try to use MetaMask.'}));
    } else {
      try {
        const network = yield getNetwork();

        if (network.networkId !== process.env.NETWORK) {
          if (process.env.NETWORK === '1') {
            throw new Error('Please, switch your Ethereum provider to Main Network');
          }
          if (process.env.NETWORK === '3') {
            throw new Error('Please, switch your Ethereum provider to Ropsten Network');
          }
          if (process.env.NETWORK === '42') {
            throw new Error('Please, switch your Ethereum provider to Kovan Network');
          }
        }

        yield put(ethActions.setNetworkData(network));

        const { application } = yield select();

        const { account } = network;
        if (!account.address && account.locked) {
          throw new Error('Please, unlock your account in MetaMask');
        }

        const {
          firstName, lastName, email, flight,
        } = application;

        const value = toWei(premium, 'ether');

        const { customerId } = yield api.getCustomerId({
          firstName,
          lastName,
          email,
          ethereumAccount: network.account.address,
        });

        const args = {
          carrierFlightNumber: `${flight.carrier}/${flight.flightNumber}`,
          departureYearMonthDay: `/dep/${moment(flight.departureTime).utc().format('YYYY/MM/DD')}`,
          departureTime: moment(flight.departureTime).unix(),
          arrivalTime: moment(flight.arrivalTime).unix(),
          customerId,
          currency: Number(currency),
          from: network.account.address,
          to: network.contract,
          value,
          gas: 1000000,
        };

        const policy = yield applyForPolicy(args);

        if (policy) {
          const applyData = {
            firstName,
            lastName,
            email,
            carrier: flight.carrier,
            flightNumber: flight.flightNumber,
            arrivesAt: flight.arrivalTime,
            departsAt: flight.departureTime,
            origin: flight.origin,
            destination: flight.destination,
            amount: value,
            currency: PAYMENT_TYPES[currency],
            ethereumAccountId: network.account.address,
            txHash: policy.txHash,
          };

          if (coupon && action.payload.couponCode && application.policy.couponCode && application.policy.couponCode.exists) {
            applyData.couponCode = application.policy.couponCode.code;
          }


          yield put(appActions.applyPolicyEthStarted());
          const apply = yield api.applyForPolicyFiat(applyData);

          yield put(appActions.createPolicyEthStarted({txHash: policy.txHash}));
          const tx = yield api.createPolicy({txHash: policy.txHash});

          const creation = yield api.waitPolicyCreation(policy.txHash, 5000);

          if (creation.flowError) {
            const flowError = JSON.parse(creation.flowError);
            if (flowError.type === 'DeclinedBySmartContract') {
              yield put(appActions.errorDialog({
                title: 'Transaction error has occurred',
                message: 'Your transaction is declined for some reasons. Please, contact the administrator by email: policies@etherisc.com',
              }));
            }
          } else {
            yield put(apiActions.reqCustomerPolicies({ customerId: apply.customerId }));

            yield put(appActions.policyApplied({
              ...policy,
              ...apply,
              ...creation,
              ...action.payload,
            }));
          }
        }
      } catch (err) {
        yield put(errorHandler(err.err || err));
      }
    }
  } else {
    let couponCode = null;
    if (coupon) {
      couponCode = yield api.getCoupon(coupon, date);
    }

    yield put(appActions.setPolicyTableFiat({ ...action.payload, couponCode }));
  }
}

function* web3RequestsWatcher() {
  yield all([
    takeLatest(ethActions.reqNetworkData, requestNetworkData),
    takeLatest(appActions.submitPolicyTable, processPolicyTableSubmit),
  ]);
}

export default web3RequestsWatcher;
