/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');

describe('Portfolio', () => {
  describe('constructor', () => {
    it('should construct a new Portfolio object', () => {
      const p1 = new Portfolio('Scott');
      expect(p1.name).to.equal('Scott');
      expect(p1.stocks).to.have.length(0);
    });
  });
  describe('#addStock', () => {
    it('should add a stock to stocks array', () => {
      const p1 = new Portfolio('Scott');
      const s1 = new Stock('aapl');
      const s2 = new Stock('v');
      p1.addStock(s1);
      p1.addStock(s2);
      expect(p1.stocks).to.have.length(2);
      expect(p1.stocks[0].symbol).to.equal('AAPL');
    });
  });
  describe('#position', () => {
    it('should return the total value of all stocks in the portfolio', () => {
      const p1 = new Portfolio('Scott');
      const s1 = new Stock('aapl');
      const s2 = new Stock('v');
      p1.addStock(s1);
      p1.addStock(s2);
      s1.shares = 10;
      s1.purchasePricePerShare = 50;
      s2.shares = 100;
      s2.purchasePricePerShare = 5;
      // console.log('postion',p1.position();
      expect(p1.position()).to.equal(1000);
      s1.shares = 5;
      expect(p1.position()).to.equal(750);
    });
  });
});
