# Free Proxy

[![npm version](https://badge.fury.io/js/free-proxy.svg)](https://badge.fury.io/js/free-proxy)
![ndoe version](https://img.shields.io/node/v/free-proxy.svg)
![github tag](https://img.shields.io/github/tag-date/lenconda/free-proxy.svg)
![monthly downloads](https://img.shields.io/npm/dm/free-proxy.svg)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/lenconda/free-proxy/blob/master/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

Fetch free proxies from https://www.free-proxy-list.com

## Features

- Fetch HTTP/HTTPS proxies
- Promise and async/await support
- ES6 class support
- Get proxies in medium and high speed
- Non-Chinese proxies

## Requirements

| Item        | Details                                               |
| ----------- | ------------------------------------------------------------ |
| System      | GNU/Linux (>=2.6.x), macOS (>=10.10.x), Windows (later than XP) |
| Environment | Node.js >= 8.2.0                                              |

## Installation

```bash
# under product mode
$ npm install free-proxy --save

# under development mode
$ npm install free-proxy --save-dev
```

## Quick Start

After you finished the installation above, you will have a package `free-proxy` in your `./node_modules` directory.

### Import

Default module exports in CommonJS style

```javascript
const ProxyList = require('free-proxy');
const proxyList = new ProxyList();
```

### Usages

###### proxyList.get()

Get proxy list. This function will craw the website and returns an array of proxy list, and some information (e.g. IP address, port, country, etc.) wrapped in a Promise object.

Recommanded usage:

```javascript
let proxies;
try {
  proxies = await proxyList.get();
} catch (error) {
  throw new Error(error);
}
```

or alternatively:

```javascript
proxyList.get()
          .then(function (proxies) {
            // get proxies here
          })
          .catch(function (error) {
            throw new Error(error);
          });
```

###### proxyList.random()

Get a proxy randomly. Based on `proxyList.get()`, this function will get a random item from the results of `proxyList.get()`

Recommanded usage:

```javascript
let data;
try {
  data = await proxyList.random();
} catch (error) {
  throw new Error(error);
}
```

or alternatively:

```javascript
proxyList.random()
          .then(function (data) {
            // get data here
          })
          .catch(function (error) {
            throw new Error(error);
          });
```

## Tests

To run the test suite, go to the root directory of this package, and install dependencies, and then run `npm test` or `npm run test`:

```bash
$ cd /path/to/free-proxy
$ npm install
$ npm test
# or
$ npm run test
```

# License

[MIT](License)