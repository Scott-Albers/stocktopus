/* eslint-disable func-names  */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

function Portfolio(name) {
  this.name = name;
  this.stocks = [];
}

Portfolio.prototype.addStock = function (stock) {
  this.stocks.push(stock);
};

Portfolio.prototype.position = function () {
  return this.stocks.reduce((acc, val) => acc + (val.shares * val.purchasePricePerShare), 0);
};


module.exports = Portfolio;
