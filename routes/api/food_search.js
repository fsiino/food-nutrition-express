const express = require('express');
const router = express.Router();

const Food = require("../../models/Food");

router.get('/:nutrient/:min?/:max?', (req, res) => {
  let nutrient = req.params.nutrient;
  let min = req.params.min;
  let max = req.params.max;
  Food.find({
    "nutrients": { $elemMatch: { nutrient: nutrient, value: { $gt: min, $lte: max } } }
  })
    .sort({ name: 1 })
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ nofoodsfound: 'No foods found with the specified ingredient parameters' }));
});

module.exports = router;