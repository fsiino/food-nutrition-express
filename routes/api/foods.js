const express = require('express');
const router = express.Router();

const Food = require("../../models/Food");

router.get('/', (req, res) => {
  Food.find()
    .sort({ name: 1 })
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ nofoodsfound: 'No foods found' }))
});

router.get('/:ndbno', (req, res) => {
  Food.find({ ndbno: req.params.ndbno })
    .sort({ name: 1 })
    .then(food => res.json(food))
    .catch(err => res.status(404).json({ nofoodfound: 'No food found with that id' }))
});

//TODO: chain queries for multiple search query params
// router.get('/:nutrient/min=:min&max=:max*', (req, res) => {
router.get('/*', (req, res) => {
  let fieldsets = req.params[0].split('/')
  let parsedSets = fieldsets.map(fieldset => fieldset.split('&'))
  let arr = [];
  for (let i = 0; i < parsedSets.length; i++) {
    let obj = {};
    for (let j = 0; j < parsedSets[i].length; j++) {
      const pair = parsedSets[i][j].split('=')
      obj[pair[0]] = pair[1]
    }
    arr.push(obj)
  }
  console.log(arr)

  let nutrient = req.params.nutrient
  // Creates a regex of: /SomeStringToFind/i 
  let nutrientRegex = new RegExp(["", nutrient, ""].join(""), "i");
  let min = req.params.min 
  let max = req.params.max 
  Food.find({
    $and: [
      { nutrients: { $elemMatch: { nutrient: nutrientRegex, value: { $gt: min, $lte: max } } } }
    ]
  })
    .sort({ name: 1 })
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ nofoodsfound: 'No foods found with the specified ingredient parameter(s)' }));
});

module.exports = router;