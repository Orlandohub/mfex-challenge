const fs = require('fs');

const zooFilePath = process.cwd() + '/data/zoo.xml'

exports.getZooData = () => {
  return fs.readFileSync(zooFilePath);
}
