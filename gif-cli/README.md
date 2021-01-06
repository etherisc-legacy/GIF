gifcli
======



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gifcli.svg)](https://npmjs.org/package/gifcli)
[![Downloads/week](https://img.shields.io/npm/dw/gifcli.svg)](https://npmjs.org/package/gifcli)
[![License](https://img.shields.io/npm/l/gifcli.svg)](https://github.com/kandrianov/gifcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @etherisc/gifcli
$ gifcli COMMAND
running command...
$ gifcli (-v|--version|version)
@etherisc/gifcli/1.1.16 linux-x64 node-v10.15.3
$ gifcli --help [COMMAND]
USAGE
  $ gifcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gifcli artifact:get`](#gifcli-artifactget)
* [`gifcli artifact:send`](#gifcli-artifactsend)
* [`gifcli console`](#gifcli-console)
* [`gifcli exec`](#gifcli-exec)
* [`gifcli help [COMMAND]`](#gifcli-help-command)
* [`gifcli product:create`](#gifcli-productcreate)
* [`gifcli product:select`](#gifcli-productselect)
* [`gifcli user:login`](#gifcli-userlogin)
* [`gifcli user:logout`](#gifcli-userlogout)
* [`gifcli user:register`](#gifcli-userregister)
* [`gifcli version`](#gifcli-version)

## `gifcli artifact:get`

Get artifact

```
USAGE
  $ gifcli artifact:get

OPTIONS
  -c, --contract=contract  (required) contract name

DESCRIPTION
  ...
  Get artifact for contract
```

## `gifcli artifact:send`

Send artifact

```
USAGE
  $ gifcli artifact:send

OPTIONS
  -f, --file=file        (required) truffle artifacts file
  -n, --network=network  (required) network

DESCRIPTION
  ...
  Send artifacts
```

## `gifcli console`

run console mode

```
USAGE
  $ gifcli console

DESCRIPTION
  ...
  Run console mode
```

## `gifcli exec`

execute file

```
USAGE
  $ gifcli exec

OPTIONS
  -f, --file=file  (required) file to execute

DESCRIPTION
  ...
  Execute file
```

## `gifcli help [COMMAND]`

display help for gifcli

```
USAGE
  $ gifcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `gifcli product:create`

Create new product

```
USAGE
  $ gifcli product:create

DESCRIPTION
  ...
  Create new product
```

## `gifcli product:select`

Select current product

```
USAGE
  $ gifcli product:select

DESCRIPTION
  ...
  Select current product
```

## `gifcli user:login`

Log into in GIF

```
USAGE
  $ gifcli user:login

DESCRIPTION
  ...
  Log into GIF
```

## `gifcli user:logout`

Logout

```
USAGE
  $ gifcli user:logout

DESCRIPTION
  ...
  Logout
```

## `gifcli user:register`

Register in GIF

```
USAGE
  $ gifcli user:register

DESCRIPTION
  ...
  Register in GIF
```

## `gifcli version`

print version

```
USAGE
  $ gifcli version

DESCRIPTION
  ...
  Print version
```
<!-- commandsstop -->
