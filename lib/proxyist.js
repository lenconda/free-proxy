const superagent = require('superagent');
const cheerio = require('cheerio');
const countryCodes = require('./countryCodes.json')

class ProxyList {

  constructor() {
    this.cached = [];
  }

  /**
   * Fetch proxies list.
   * @param {Number} page
   * @returns {Promise<object>}
   */
  fetchProxiesList (page) {
    return new Promise (function (resolve, reject) {
      superagent.get(`https://www.free-proxy-list.com/?search=1&page=${page}&port=&type%5B%5D=http&type%5B%5D=https&speed%5B%5D=2&speed%5B%5D=3&connect_time%5B%5D=2&connect_time%5B%5D=3&up_time=0`)
                .then(function (res) {
                  let $ = cheerio.load(res.text);
                  let results = [];
                  let listsRaw = $('div.container > div.content-wrapper > div.section > div.table-responsive > table > tbody > tr');
                  listsRaw.each(function (index, item) {
                    let children = $(item).find('td:not(.report-cell)');
                    let proxyItem = {};
                    const countryName = $(children[2]).text().replace(/[\t\n]/g, '');
                    proxyItem.ip = $(children[0]).text();
                    proxyItem.port = $(children[1]).text();
                    proxyItem.country = countryName;
                    proxyItem.countryCode = countryCodes[countryName];
                    proxyItem.protocol = $(children[7]).text();
                    proxyItem.connect_time = $(children[5]).text().replace(/[\t\n]/g, '');
                    proxyItem.up_time = $(children[6]).text().replace(/[\t\n]/g, '');
                    proxyItem.last_update = $(children[9]).text();
                    proxyItem.speed_download = $(children[4]).text().replace(/[\t\n]/g, '');
                    proxyItem.url = `${proxyItem.protocol}://${proxyItem.ip}:${proxyItem.port}`;
                    if (proxyItem.country !== 'China') results.push(proxyItem);
                  });
                  resolve(results);
                })
                .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get all items of the list
   * @returns {Promise<object>}
   */
  get () {
    let _this = this;
    return new Promise (function (resolve, reject) {
      superagent.get('https://www.free-proxy-list.com/?search=1&page=1&port=&type%5B%5D=http&type%5B%5D=https&speed%5B%5D=2&speed%5B%5D=3&connect_time%5B%5D=2&connect_time%5B%5D=3&up_time=0')
                .then(function (res) {
                  let $ = cheerio.load(res.text);
                  let pagerRaw = $('ul.pagination.content-list-pager > li.pager-item');
                  let maxPageNum = parseInt($(pagerRaw[pagerRaw.length - 3]).text());
                  let responseArray = [];
                  for (let i = 1; i < maxPageNum + 1; i++) responseArray.push(_this.fetchProxiesList(i));
                  Promise.all(responseArray)
                          .then(function (responses) {
                            let results = [];
                            for (let i = 0; i < responses.length; i++) results = results.concat(responses[i]);
                            return results;
                          })
                          .then(function (results) { resolve(results); })
                          .catch(function (err) { reject(err); });
                })
                .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get all items of the list in a specific countryCode
   * @returns {Promise<object>}
   */
  getByCountryCode (countryCode) {
    let _this = this;
    return new Promise (function (resolve, reject) {
      _this.get()
            .then(function (res) {
              resolve(res.filter(proxy => proxy.countryCode === countryCode));
            })
            .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get all items of the list that uses a given protocol
   * @param {String} protocol 
   * @returns {Promise<object>}
   */
  getByProtocol (protocol) {
    let _this = this;
    return new Promise (function (resolve, reject) {
      _this.get()
            .then(function (res) {
              resolve(res.filter(proxy => proxy.protocol === protocol));
            })
            .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get a random item from the list
   * @returns {Promise<object>}
   */
  random () {
    let _this = this;
    return new Promise (function (resolve, reject) {
      _this.get()
            .then(function (res) {
              resolve(res[Math.floor(Math.random() * res.length) + 1]);
            })
            .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get a random item from the list in a specific country
   * @returns {Promise<object>}
   */
  randomByCountryCode (countryCode) {
    let _this = this;
    return new Promise (function (resolve, reject) {
      _this.getByCountryCode(countryCode)
            .then(function (res) {
              resolve(res[Math.floor(Math.random() * res.length)]);
            })
            .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get a random proxy that us using a given protocol
   * @param {String} protocol 
   * @returns 
   */
  randomByProtocol (protocol) {
    let _this = this;
    return new Promise (function (resolve, reject) {
      _this.getByProtocol(protocol)
            .then(function (res) {
              resolve(res[Math.floor(Math.random() * res.length)]);
            })
            .catch(function (err) { reject(err); });
    });
  }

  /**
   * Get a random item from the list
   * @returns {Promise<object>}
   */
  randomFromCache () {
    let _this = this;
    return new Promise (function (resolve, reject) {
      if (_this.cached.length < 1) {
        _this.get()
              .then(function (res) {
                _this.cached = res;
                resolve(_this.cached.shift());
              })
              .catch(function (err) { reject(err); });
      } else {
        const random = Math.floor(Math.random() * _this.cached.length);
        const result = _this.cached.splice(random, 1);
        resolve(result[0]);
      }
    });
  }

}

module.exports = ProxyList
