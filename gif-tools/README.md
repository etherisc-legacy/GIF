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
@etherisc/gif-tools/0.1.1 linux-x64 node-v12.21.0
$ gif-tools --help [COMMAND]
USAGE
  $ gif-tools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gif-tools help [COMMAND]`](#gif-tools-help-command)
* [`gif-tools selectResources`](#gif-tools-selectresources)
* [`gif-tools updateSolcVersion`](#gif-tools-updatesolcversion)
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

## `gif-tools selectResources`

Select resources for compile / migrate / test

```
USAGE
  $ gif-tools selectResources
```

_See code: [src/commands/selectResources.js](https://github.com/etherisc/GIF/blob/v0.1.1/src/commands/selectResources.js)_

## `gif-tools updateSolcVersion`

Set solc compiler version in smart contracts-available. Version should be specified in package.json

```
USAGE
  $ gif-tools updateSolcVersion
```

_See code: [src/commands/updateSolcVersion.js](https://github.com/etherisc/GIF/blob/v0.1.1/src/commands/updateSolcVersion.js)_

## `gif-tools verify`

Prepare verification of contracts-available

```
USAGE
  $ gif-tools verify
```

_See code: [src/commands/verify.js](https://github.com/etherisc/GIF/blob/v0.1.1/src/commands/verify.js)_
<!-- commandsstop -->
