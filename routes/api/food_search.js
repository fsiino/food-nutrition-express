const express = require('express');
const router = express.Router();

const Food = require("../../models/Food");

router.get('/:nutrient', (req, res) => {
  let name = req.params.nutrient;
  Food.find(food =>  { name })
    .sort({ name: 1 })
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ nofoodsfound: 'No foods found with that ingredient' }));
});

module.exports = router;