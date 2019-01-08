import fetch from 'isomorphic-fetch';
import CustomConfig from './../../shared/customConfig';

export async function healthCheck() {
  const url = '/api/health-check';
  const response = await fetch(url, {
    credentials: 'include',
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getReservation(reservationCode, firstname, lastname) {
  const url = `/api/reservations/${reservationCode}/${lastname}/${firstname}`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function searchFlights(origin, destination, date) {
  const url = '/api/flights/search';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin, destination, date }),
    credentials: 'include',
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getAirports() {
  const url = '/api/airports';
  const response = await fetch(url, {
    credentials: 'include',
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getFlightRating(carrier, flightNumber) {
  const url = `/api/flights/rating/${carrier}/${flightNumber}`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function applyForPolicyFiat(data) {
  const url = '/api/policies';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  CustomConfig.onPolicyCreated(body);
  return body;
}

export async function getCustomerPolicies(customerId) {
  const url = `/api/customers/${customerId}/policies`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getCustomerId(data) {
  const url = '/api/customers';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function createPolicy(data) {
  const url = '/api/policies/create';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getScheduleFields(data) {
  const url = '/api/schedule';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getCertificate(certificateId) {
  const url = `/api/policies/${certificateId}`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (response.status === 404) {
    throw URIError('', 404);
  }

  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function getCoupon(coupon, date) {
  const url = `/api/coupons/${coupon}?date=${date}`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  const body = response.json();

  if (response.status !== 200) {
    throw Error(body.message || body.error || body);
  }

  return body;
}

export async function waitPolicyCreation(txHash, interval = 2000) {
  let timeout;

  const waitAsync = async (txHash, resolve, reject) => {
    if (!timeout) return;

    try {
      const req = await fetch('/api/policies/checkPolicyJob', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash }),
        credentials: 'include',
      });

      const res = await req.json();

      if (res.flowStatus === 'created') {
        resolve(res);

        clearTimeout(timeout);
        timeout = null;
      } else {
        setTimeout(() => waitAsync(txHash, resolve, reject), interval);
      }
    } catch (e) {
      setTimeout(() => waitAsync(txHash, resolve, reject), interval);
    }
  };

  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      resolve({ flowStatus: 'time_is_out' });
      timeout = null;
    }, CustomConfig.workflow.waitTxTimeout);

    waitAsync(txHash, resolve, reject);
  });
}

export default {
  healthCheck,
  getReservation,
  searchFlights,
  getAirports,
  getFlightRating,
  applyForPolicyFiat,
  getCustomerPolicies,
  getCustomerId,
  getCertificate,
  createPolicy,
  getCoupon,
  waitPolicyCreation,
  getScheduleFields,
};
