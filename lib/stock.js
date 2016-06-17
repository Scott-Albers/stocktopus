/* eslint-disable func-names  */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

const request = require('request');

function Stock(symbol) {
  this.symbol = symbol.toUpperCase();
  this.shares = 0;
}

Stock.prototype.purchase = function (quantity, cb) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request({ url, method: 'GET', json: true }, (err, rsp, body) => {
//    console.log('body:', body);
    this.purchasePricePerShare = body.LastPrice;
    this.name = body.Name;
    this.shares += quantity;
    this.purchaseDate = new Date();
    const totalPaid = this.shares * this.purchasePricePerShare;
    cb(null, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, cb) {
  if (quantity > this.shares) {
    return cb(new Error('insufficient shares'), 0);
  }
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request({ url, method: 'GET', json: true }, (err, rsp, body) => {
//    console.log('body:', body);
    this.sellPricePerShare = body.LastPrice;
    this.shares -= quantity;
    const totalReceived = this.shares * this.sellPricePerShare;
    cb(null, totalReceived);
  });
};

Stock.getQuote = function (symbol, cb) {
  const stockSymbol = symbol.toUpperCase();
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${stockSymbol}`;
  request({ url, method: 'GET', json: true }, (err, rsp, body) => {
    const stockPrice = body.LastPrice;
    cb(null, stockPrice);
  });
};

module.exports = Stock;
