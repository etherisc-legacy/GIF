## Install

Prerequisites: truffle installed

```
$ npm i -g @etherisc/gif-tools
$ git clone https://github.com/etherisc/GIF.git
$ cd GIF/gif-contracts
$ cp .env.sample .env
$ nano .env  # edit values for mnemonics etc.
$ gif-tools select-resources
$ truffle compile --all
$ truffle migrate --reset
```

## Documentation

[GIF Tutorial Series](https://blog.etherisc.com/etherisc-tutorial-series-part-one-understanding-decentralized-insurance-and-the-etherisc-generic-d8be9ede930)
