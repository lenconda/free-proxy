const superagent = require('superagent');
const cheerio = require('cheerio');

class ProxyList {

  constructor() {
    // super();
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
                    proxyItem.ip = $(children[0]).text();
                    proxyItem.port = $(children[1]).text();
                    proxyItem.country = $(children[2]).text().replace(/[\t\n]/g, '');
                    proxyItem.protocal = $(children[7]).text();
                    proxyItem.connect_time = $(children[5]).text().replace(/[\t\n]/g, '');
                    proxyItem.up_time = $(children[6]).text().replace(/[\t\n]/g, '');
                    proxyItem.last_update = $(children[9]).text();
                    proxyItem.speed_download = $(children[4]).text().replace(/[\t\n]/g, '');
                    proxyItem.url = `${proxyItem.protocal}://${proxyItem.ip}:${proxyItem.port}`;
                    if (proxyItem.country !== 'China') results.push(proxyItem);
                  });
                  resolve(results);
                })
                .catch(function (err) {
                  reject(err);
                });
    });
  }

  /**
   * Get all items of the list
   * @returns {Promise<object>}
   */
  async get () {
    let _this = this;
    return new Promise (function (resolve, reject) {
      superagent.get('https://www.free-proxy-list.com/?search=1&page=1&port=&type%5B%5D=http&type%5B%5D=https&speed%5B%5D=2&speed%5B%5D=3&connect_time%5B%5D=2&connect_time%5B%5D=3&up_time=0')
                .then(function (res) {
                  let $ = cheerio.load(res.text);
                  let pagerRaw = $('ul.pagination.content-list-pager > li.pager-item');
                  let maxPageNum = parseInt($(pagerRaw[pagerRaw.length - 3]).text());
                  let result = [];
                  for (let i = 1; i < maxPageNum + 1; i++) {
                    _this.fetchProxiesList(i)
                        .then(function (results) {
                          result = result.concat(results);
                          if (i === maxPageNum) resolve(result);
                        })
                        .catch(function (err) {
                          reject(err);
                        });
                  }
                })
                .catch(function (err) {
                  reject(err);
                });
    });
  }

  /**
   * Get a random item from the list
   * @returns {Promise<object>}
   */
  async random () {
    let _this = this;
    return new Promise (function (resolve, reject) {
      _this.get()
            .then(function (res) {
              resolve(res[Math.floor(Math.random() * res.length) + 1]);
            })
            .catch(function (err) { reject(err); });
    });
  }

}

modules.exports = ProxyList
modules.exports.proxyList = new ProxyList();