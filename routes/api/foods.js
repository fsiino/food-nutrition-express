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

router.get('/:nutrient/min=:min?&max=:max?', (req, res) => {
  let nutrient = req.params.nutrient;
  let min = req.params.min 
  let max = req.params.max 
  Food.find({
    "nutrients": { $elemMatch: { nutrient: nutrient, value: { $gt: min, $lte: max } } }
  })
    .sort({ name: 1 })
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ nofoodsfound: 'No foods found with the specified ingredient parameter(s)' }));
});

module.exports = router;