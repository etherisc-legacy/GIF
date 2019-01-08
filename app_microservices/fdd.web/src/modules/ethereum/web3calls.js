import AddressResolverInterface from './interfaces/FlightDelayAddressResolver.json';
import NewPolicyInterface from './interfaces/FlightDelayNewPolicy.json';

export function toWei(value, fraction) {
  return Number(window.web3.toWei(value, fraction));
}

function checkConnection() {
  return new Promise((resolve) => {
    resolve(window.web3.isConnected());
  });
}

function getBlockNumber() {
  return new Promise((resolve, reject) => {
    window.web3.eth.getBlockNumber((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

function getNetworkId() {
  return new Promise((resolve, reject) => {
    window.web3.version.getNetwork((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

function getAccount() {
  return new Promise((resolve, reject) => {
    window.web3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject({err});
      } else {
        resolve({
          address: accounts[0],
          locked: window.web3.eth.accounts && window.web3.eth.accounts.length === 0,
        });
      }
    });
  });
}

function getBalance(account) {
  return new Promise((resolve, reject) => {
    if (!account) {
      reject('Please unlock your account in MetaMask');
    }
    window.web3.eth.getBalance(account, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(Number(window.web3.fromWei(res.toNumber())).toFixed(2));
    });
  });
}

function getFlightDelayAddress(networkId) {
  return new Promise((resolve, reject) => {
    let FAR;
    if (networkId > 0) {
      FAR = process.env.FD_ADDRESS_RESOLVER_DEV;
    } else {
      reject({err: 'Unknown network'});
    }

    window.web3.eth.contract(AddressResolverInterface)
      .at(FAR)
      .getAddress((err, address) => {
        if (err) {
          reject(err);
        }
        resolve(address);
      });
  });
}

export async function getNetwork() {
  const isConnected = await checkConnection();
  const blockNumber = await getBlockNumber();
  const networkId = await getNetworkId();
  const account = await getAccount();
  const balance = !account.locked && await getBalance(account.address);
  const contract = await getFlightDelayAddress(networkId);

  return {
    blockNumber, networkId, account, balance, contract, isConnected,
  };
}

export async function applyForPolicy(args) {
  const txHash = await new Promise((resolve, reject) => {
    window.web3.eth.contract(NewPolicyInterface)
      .at(args.to)
      .newPolicy(
        args.carrierFlightNumber,
        args.departureYearMonthDay,
        args.departureTime,
        args.arrivalTime,
        args.currency,
        args.customerId,
        {
          from: args.from,
          to: args.to,
          value: args.value,
          gas: args.gas,
        },
        (err, result) => {
          if (err) {
            if (err.message.indexOf('User denied transaction signature') > -1)
              err.message = 'You rejected transaction';
            reject({err});
          }
          resolve(result);
        },
      );
  });

  return {txHash};
}
