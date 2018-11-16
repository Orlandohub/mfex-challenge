const fs = require('fs');
const _ = require('lodash');

exports.getFileData = () => {
  return fs.readFileSync(process.cwd() + '/data/prices.txt', 'utf8');
}

exports.getPrices = (data) => {
  let pricesData = {};
  // Split string on line break to isolate results as `key=value`
  const lines = data.split('\n');
  _.forEach(lines, (keyValue) => {
    const key = keyValue.split('=')[0]
    const value = parseFloat(keyValue.split('=')[1])
    pricesData[key] = value
  });

  return pricesData
}