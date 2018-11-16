const csvFilePath = process.cwd() + '/data/animals.csv'
const csv=require('csvtojson')

exports.animalsConsumptionData = csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
    return jsonObj;
  })

