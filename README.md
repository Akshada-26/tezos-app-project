# TZMINT Smart contract and wrapper functions

This repository is a submodule of the main project [tezos-cso-project](https://github.com/b9lab/tezos-cso-project), which contains code for an example project which is part of the educational course on the [Tezos Developer Platform](https://tezos.b9lab.com) by [B9lab](https://b9lab.com). While it contains a working full stack application, it is intended for demonstration purposes only and **not to run in a production environment / mainnet** without further adjustments.

You can find the deployed [TZMINT web application](https://tzmint.b9lab.com) online, and more information in the [Rolling Safe Sample](https://tezos.b9lab.com/rolling-safe-project) Module in the educational course.


## Install

After cloning, in the root folder, run:

```shell
$ npm install
```

## Test

Run all tests, and run the code style checks, with:

```shell
$ npm test
```

If you want to only test unit tests, do:

```shell
$ ./node_modules/.bin/mocha test test/unit --recursive
```