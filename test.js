const chai = require('chai');
const prices = require('./api/prices');

chai.should();

const pricesMock = `Meat=12.56
Fruit=5.60`

describe('Prices', function() {
  it('should return array of objects for each line with food and price', function() {
    const pricesData = prices.getPrices(pricesMock);
    pricesData.should.be.a('object');
    pricesData.Meat.should.equal(12.56);
    pricesData.Fruit.should.equal(5.60);
  });

});