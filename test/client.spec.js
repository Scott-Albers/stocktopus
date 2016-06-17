/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
// const Stock = require('../lib/stock');
// const Portfolio = require('../lib/portfolio');
const Client = require('../lib/client');
const nock = require('nock');
// const sinon = require('sinon');
// let clock;

describe('Client', () => {
  before(() => {
    // clock = sinon.useFakeTimers();
    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 500,
    });
  });
  after(() => {
    nock.cleanAll();
  });

  describe('constructor', () => {
    it('should construct a new Client object', () => {
      const c1 = new Client('Alex');
      expect(c1.name).to.equal('Alex');
      expect(c1.portfolios).to.have.length(0);
      expect(c1.cashBalance).to.equal(0);
    });
  });
  describe('#deposit', () => {
    it('should deposit cash and increase the cash balance', () => {
      const c1 = new Client('Alex');
      c1.deposit(1000);
      expect(c1.cashBalance).to.equal(1000);
      c1.deposit(2000);
      expect(c1.cashBalance).to.equal(3000);
    });
  });
  describe('#withdraw', () => {
    it('should withdraw cash and decrease the cash balance', () => {
      const c1 = new Client('Alex');
      c1.deposit(1000);
      c1.withdraw(500);
      expect(c1.cashBalance).to.equal(500);
    });
    it('should withdraw cash and fail if not enough funds', () => {
      const c1 = new Client('Alex');
      c1.deposit(1000);
      c1.withdraw(5000);
      expect(c1.cashBalance).to.equal(1000);
    });
  });
  describe('#purchaseStock', () => {
    it('should purchase stock and add to Portfolio', (done) => {
      const c1 = new Client('Alex');
      c1.cashBalance = 10000;
      // clock.tick(150);
      c1.purchaseStock('aapl', 10, 'Tech', (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(5000);
        expect(c1.cashBalance).to.equal(5000);
        expect(c1.portfolios).to.have.length(1);
        expect(c1.portfolios[0].name).to.equal('Tech');
        expect(c1.portfolios[0].stocks[0].name).to.equal('Apple');
        expect(c1.portfolios[0].stocks[0].shares).to.equal(10);
        done();
      });
    });
    it('should try and fail to purchase stock', (done) => {
      const c1 = new Client('Alex');
      c1.cashBalance = 100;
      // clock.tick(150);
      c1.purchaseStock('aapl', 10, 'Tech', (err) => {
        expect(err).to.exist
            .and.be.instanceof(Error)
            .and.have.property('message', 'insufficient funds');
        expect(c1.cashBalance).to.equal(100);
        expect(c1.portfolios).to.have.length(0);
        done();
      });
    });
  });
});
