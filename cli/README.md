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
gifcli/0.0.0 darwin-x64 node-v11.12.0
$ gifcli --help [COMMAND]
USAGE
  $ gifcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gifcli artifact:send`](#gifcli-artifactsend)
* [`gifcli autocomplete [SHELL]`](#gifcli-autocomplete-shell)
* [`gifcli console`](#gifcli-console)
* [`gifcli exec`](#gifcli-exec)
* [`gifcli help [COMMAND]`](#gifcli-help-command)
* [`gifcli product:create`](#gifcli-productcreate)
* [`gifcli product:select`](#gifcli-productselect)
* [`gifcli update [CHANNEL]`](#gifcli-update-channel)
* [`gifcli user:logout`](#gifcli-userlogout)
* [`gifcli user:register`](#gifcli-userregister)

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

## `gifcli autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ gifcli autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ gifcli autocomplete
  $ gifcli autocomplete bash
  $ gifcli autocomplete zsh
  $ gifcli autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.0/src/commands/autocomplete/index.ts)_

## `gifcli console`

Run console mode

```
USAGE
  $ gifcli console

DESCRIPTION
  ...
  Run console mode
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

## `gifcli update [CHANNEL]`

update the gifcli CLI

```
USAGE
  $ gifcli update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_

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
<!-- commandsstop -->
