const prices = require('./api/prices');
const animals = require('./api/animals');
const zoo = require('./api/zoo');
const xml2js = require('xml2js');
const _ = require('lodash');

const parser = new xml2js.Parser();

// Global
let total = 0;
let zooAnimals = {};
let animalsConsumptionData = {};

// Prices
const data = prices.getFileData();
const priceData = prices.getPrices(data);

// Zoo
const zooXmlData = zoo.getZooData();

parser.parseString(zooXmlData, function (err, result) {
  // Iterate zoo new object and format it
  _.forEach(result.Zoo, (value, key) => {
    // Get the singular animal names to extract list of animals
    const singularAnimalName = singularName(key);
    zooAnimals[key] = value[0][singularAnimalName];
  });
  // Animals consumption data
  animals.animalsConsumptionData.then(results => {
    _.forEach(results, (value) => {
      animalsConsumptionData[value.Animal] = _.omit(value, ['Animal']);
    });
    // Once all data loaded and formatted initiate calculation
    init();
  });
});

function animalGeneralCalc(animal, animalType) {
  const { rate } = animalsConsumptionData[singularName(animalType)]
  const foodAmount = parseFloat(animal.$.kg) * parseFloat(rate);
  const pricePerKilo = priceData[_.upperFirst(animalsConsumptionData[singularName(animalType)].food)];
  return foodAmount * pricePerKilo;
}

function animalOmnivoresCalc(animal, animalType) {
  const percentualValue = animalsConsumptionData[singularName(animalType)].percentage;
  const meatPercentage = parseFloat(percentualValue) * 0.01;
  const { rate } = animalsConsumptionData[singularName(animalType)];
  const foodAmount = parseFloat(animal.$.kg) * parseFloat(rate);
  const meatAmount = foodAmount * meatPercentage;
  const fruitAmount = foodAmount - meatAmount;
  const fruitCost = priceData.Fruit * fruitAmount;
  const meatCost = priceData.Meat * meatAmount;
  return fruitCost + meatCost;
}

function singularName(name) {
  return name === 'Wolves' ? 'Wolf' : name.substring(0, name.length-1);
}

function calculateFeedingCost(animalType, animalList) {
  _.forEach(animalList, (animal) => {
    switch(animalType) {
      case 'Wolves':
        total += animalOmnivoresCalc(animal, animalType)
        break;
      case 'Piranhas':
        total += animalOmnivoresCalc(animal, animalType)
        break;
      default:
        total += animalGeneralCalc(animal, animalType)
    }
  });
}

function init() {
  _.forEach(zooAnimals, (value, key) => {
    calculateFeedingCost(key, value)
  })
  console.log('\n\n###########>>> TOTAL <<<##########\n\n');
  console.log('$', total);
  console.log('\n\n###########>>><<<##########\n\n');
}