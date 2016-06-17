/* eslint-disable func-names  */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');

function Client(name) {
  this.name = name;
  this.cashBalance = 0;
  this.portfolios = [];
}

Client.prototype.deposit = function (amount) {
  this.cashBalance += amount;
};

Client.prototype.withdraw = function (amount) {
  if (amount < this.cashBalance) {
    this.cashBalance -= amount;
  }
};

Client.prototype.purchaseStock = function (symbol, quantity, portfolio, cb) {
  Stock.getQuote(symbol, (err, quotePrice) => {
    if ((quotePrice * quantity) > this.cashBalance) {
      return cb(new Error('insufficient funds'), 0);
    } else {
      const stock = new Stock(symbol);
      stock.purchase(quantity, (err2, totalpaid) => {
        this.cashBalance -= totalpaid;
        const indexOfPortfolio = this.portfolios.indexOf(portfolio);
        if (indexOfPortfolio !== -1) {
          this.portfolios[indexOfPortfolio].addStock(stock);
        } else {
          const newPortfolio = new Portfolio(portfolio);
          newPortfolio.addStock(stock);
          this.portfolios.push(newPortfolio);
        }
        cb(null, totalpaid);
      });
    }
  });

  // const stock = new Stock(symbol);
  // stock.purchase(quantity, (err, totalpaid) => {
  //   this.cashBalance -= totalpaid;
  //   const indexOfPortfolio = this.portfolios.indexOf(portfolio);
  //   if (indexOfPortfolio !== -1) {
  //     this.portfolios[indexOfPortfolio].addStock(stock);
  //   } else {
  //     const newPortfolio = new Portfolio(portfolio);
  //     newPortfolio.addStock(stock);
  //     this.portfolios.push(newPortfolio);
  //   }
  //   cb(null, totalpaid);
  // });
};

module.exports = Client;
