gif-tools
=========

Tools for developing GIF applications

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@etherisc/gif-tools.svg)](https://npmjs.org/package/@etherisc/gif-tools)
[![Downloads/week](https://img.shields.io/npm/dw/@etherisc/gif-tools.svg)](https://npmjs.org/package/@etherisc/gif-tools)
[![License](https://img.shields.io/npm/l/@etherisc/gif-tools.svg)](https://github.com/etherisc/gif-tools/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @etherisc/gif-tools
$ gif-tools COMMAND
running command...
$ gif-tools (-v|--version|version)
@etherisc/gif-tools/0.1.2 linux-x64 node-v12.21.0
$ gif-tools --help [COMMAND]
USAGE
  $ gif-tools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gif-tools help [COMMAND]`](#gif-tools-help-command)
* [`gif-tools select-resources`](#gif-tools-select-resources)
* [`gif-tools update-solc-version`](#gif-tools-update-solc-version)
* [`gif-tools verify`](#gif-tools-verify)

## `gif-tools help [COMMAND]`

display help for gif-tools

```
USAGE
  $ gif-tools help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `gif-tools select-resources`

Select resources for compile / migrate / test

```
USAGE
  $ gif-tools select-resources
```

_See code: [src/commands/select-resources.js](https://github.com/etherisc/GIF/blob/v0.1.2/src/commands/select-resources.js)_

## `gif-tools update-solc-version`

Set solc compiler version in smart contracts-available. Version should be specified in package.json

```
USAGE
  $ gif-tools update-solc-version
```

_See code: [src/commands/update-solc-version.js](https://github.com/etherisc/GIF/blob/v0.1.2/src/commands/update-solc-version.js)_

## `gif-tools verify`

Prepare verification of contracts-available

```
USAGE
  $ gif-tools verify
```

_See code: [src/commands/verify.js](https://github.com/etherisc/GIF/blob/v0.1.2/src/commands/verify.js)_
<!-- commandsstop -->
