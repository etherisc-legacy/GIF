import startApp from 'root/startApp';

window.Raven.config('https://c943344eb66b4a4eb0998a061aa8d5e4@sentry.io/225468').install();

window.addEventListener('load', () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // fallback
  }

  startApp();
});
