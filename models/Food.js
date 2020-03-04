const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = ({
  ndbno: {
    type: String
  },
  name: {
    type: String
  },
  weight: {
    type: String
  },
  measure: {
    type: String
  },
  nutrients: {
    type: Array
  },
  nutrient_id: {
    type: String
  },
  nutrient: {
    type: String
  },
  unit: {
    type: String
  },
  value: {
    type: String
  },
  gm: {
    type: String
  },
})

module.exports = Food = mongoose.model('food', FoodSchema)