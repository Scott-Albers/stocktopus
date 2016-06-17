/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');
const sinon = require('sinon');
let clock;

describe('Stock', () => {
  before(() => {
    clock = sinon.useFakeTimers();
    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });
  after(() => {
    nock.cleanAll();
    clock.restore();
  });

  describe('constructor', () => {
    it('should construct a new Stock object', () => {
      const s1 = new Stock('aapl');
      expect(s1.symbol).to.equal('AAPL');
    });
  });
  describe('#purchase', () => {
    it('should purchase stock', (done) => {
      const s1 = new Stock('aapl');
      clock.tick(150);
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(5000);
        expect(s1.shares).to.equal(50);
        expect(s1.purchaseDate.getTime()).to.equal(150);
        expect(s1.name).to.equal('Apple');
        expect(s1.purchasePricePerShare).to.equal(100);
        done();
      });
    });
  });
  describe('#sell', () => {
    it('should sell stock', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 50;
      s1.sell(25, (err, totalReceived) => {
        expect(err).to.be.null;
        expect(totalReceived).to.equal(2500);
        expect(s1.shares).to.equal(25);
        expect(s1.sellPricePerShare).to.equal(100);
        done();
      });
    });
    it('should sell stock, check for funds error', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 50;
      s1.sell(75, (err) => {
        expect(err).to.exist
            .and.be.instanceof(Error)
            .and.have.property('message', 'insufficient shares');
        expect(s1.shares).to.equal(50);
        done();
      });
    });
  });
  describe('.getQuote', () => {
    it('should check the stock price', (done) => {
      Stock.getQuote('aapl', (err, quotePrice) => {
        expect(err).to.be.null;
        expect(quotePrice).to.equal(100);
        done();
      });
    });
  });
});
