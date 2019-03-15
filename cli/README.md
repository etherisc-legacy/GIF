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
$ npm install -g gifcli
$ gifcli COMMAND
running command...
$ gifcli (-v|--version|version)
gifcli/0.0.0 darwin-x64 node-v11.6.0
$ gifcli --help [COMMAND]
USAGE
  $ gifcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gifcli console`](#gifcli-console)
* [`gifcli contracts:list`](#gifcli-contractslist)
* [`gifcli customer:create`](#gifcli-customercreate)
* [`gifcli customer:get`](#gifcli-customerget)
* [`gifcli customer:list`](#gifcli-customerlist)
* [`gifcli exec`](#gifcli-exec)
* [`gifcli help [COMMAND]`](#gifcli-help-command)
* [`gifcli oracle:create`](#gifcli-oraclecreate)
* [`gifcli oracle:list`](#gifcli-oraclelist)
* [`gifcli product:create`](#gifcli-productcreate)
* [`gifcli product:list`](#gifcli-productlist)
* [`gifcli product:select`](#gifcli-productselect)
* [`gifcli product:sendArtifacts`](#gifcli-productsendartifacts)
* [`gifcli user:get`](#gifcli-userget)
* [`gifcli user:login`](#gifcli-userlogin)
* [`gifcli user:logout`](#gifcli-userlogout)
* [`gifcli user:register`](#gifcli-userregister)

## `gifcli console`

Run console mode

```
USAGE
  $ gifcli console

DESCRIPTION
  ...
  Run console mode
```

## `gifcli contracts:list`

List core contracts

```
USAGE
  $ gifcli contracts:list

DESCRIPTION
  ...
  List contracts
```

## `gifcli customer:create`

Create customer

```
USAGE
  $ gifcli customer:create

DESCRIPTION
  ...
  Create customer
```

## `gifcli customer:get`

Get customer

```
USAGE
  $ gifcli customer:get

OPTIONS
  -i, --id=id  (required) customer id

DESCRIPTION
  ...
  Get customer
```

## `gifcli customer:list`

List customers

```
USAGE
  $ gifcli customer:list

OPTIONS
  -l, --limit=limit    [default: 20] records offset
  -o, --offset=offset  records limit

DESCRIPTION
  ...
  List customers
```

## `gifcli exec`

Execute file

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `gifcli oracle:create`

Create new oracle

```
USAGE
  $ gifcli oracle:create

DESCRIPTION
  ...
  Create new oracle
```

## `gifcli oracle:list`

List oracles

```
USAGE
  $ gifcli oracle:list

OPTIONS
  -l, --limit=limit    [default: 20] records offset
  -o, --offset=offset  records limit

DESCRIPTION
  ...
  List oracles
```

## `gifcli product:create`

Create new product

```
USAGE
  $ gifcli product:create

DESCRIPTION
  ...
  Create new product
```

## `gifcli product:list`

List products

```
USAGE
  $ gifcli product:list

OPTIONS
  -l, --limit=limit    [default: 20] records offset
  -o, --offset=offset  records limit

DESCRIPTION
  ...
  List products
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

## `gifcli product:sendArtifacts`

Send artifacts into GIF

```
USAGE
  $ gifcli product:sendArtifacts

DESCRIPTION
  ...
  Send artifacts into GIF
```

## `gifcli user:get`

Get current user

```
USAGE
  $ gifcli user:get

DESCRIPTION
  ...
  Get user
```

## `gifcli user:login`

Login to GIF

```
USAGE
  $ gifcli user:login

DESCRIPTION
  ...
  Login to GIF
```

## `gifcli user:logout`

Logout from GIF

```
USAGE
  $ gifcli user:logout

DESCRIPTION
  ...
  Logout from GIF
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
<!-- commandsstop -->
