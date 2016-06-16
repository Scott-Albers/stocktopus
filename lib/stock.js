/* eslint-disable func-names  */
/* eslint-disable no-console */

const request = require('request');

function Stock(symbol) {
  this.symbol = symbol.toUpperCase();
}

Stock.prototype.purchase = function (quantity, cb) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request({ url, method: 'GET', json: true, 'Content-Type': 'appl/json' }, (err, rsp, body) => {
//    console.log('body:', body);
    this.purchasePricePerShare = body.LastPrice;
    this.name = body.Name;
    this.shares = quantity;
    const totalPaid = this.shares * this.purchasePricePerShare;
    cb(null, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, cb) {
  if (quantity > this.shares) {
    cb(null, 0);
    return;
  }
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request({ url, method: 'GET', json: true, 'Content-Type': 'appl/json' }, (err, rsp, body) => {
//    console.log('body:', body);
    this.sellPricePerShare = body.LastPrice;
    this.shares -= quantity;
    const totalReceived = this.shares * this.purchasePricePerShare;
    cb(null, totalReceived);
  });
};

module.exports = Stock;
