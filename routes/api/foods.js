const express = require('express');
const router = express.Router();

const Food = require("../../models/Food");

router.get('/all', (req, res) => {
  Food.find()
    .sort({ name: 1 })
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ nofoodsfound: 'No foods found' }))
});

router.get('/id=:ndbno', (req, res) => {
  Food.find({ ndbno: req.params.ndbno })
    .sort({ name: 1 })
    .then(food => res.json(food))
    .catch(err => res.status(404).json({ nofoodfound: 'No food found with that id' }))
});

//Test: http://localhost:5000/api/foods/search/nutrient=ash&min=0&max=1/nutrient=protein&min=0&max=0.01/nutrient=alcohol&min=0&max=40/nutrient=carb&min=0&max=0.03
router.get('/search/*', (req, res) => {
  let promise = new Promise(res => {
    const fieldsets = req.params[0].split('/')
    const parsedSets = fieldsets.map(fieldset => fieldset.split('&'))
    let newFieldsets = [];
    for (let i = 0; i < parsedSets.length; i++) {
      let obj = {};
      for (let j = 0; j < parsedSets[i].length; j++) {
        const pair = parsedSets[i][j].split('=')
        obj[pair[0]] = pair[1]
      }
      if (obj['nutrient']) newFieldsets.push(obj)
    }
    let queries = newFieldsets.map(newFieldset => {
      let query = {
        nutrients: {
          $elemMatch: {
            nutrient: "",
            value: {
              $gt: 0,
              $lte: Infinity
            }
          }
        }
      };
      query.nutrients.$elemMatch.nutrient = new RegExp(["", newFieldset.nutrient, ""].join(""), "i");
      query.nutrients.$elemMatch.value.$gt = newFieldset.min;
      query.nutrients.$elemMatch.value.$lte = newFieldset.max;
      return query;
    })
    res(queries)
  })
  promise.then(queries => {
    Food.find({
      $and: queries
    })
      .sort({ name: 1 })
      .then(foods => res.json(foods))
      .catch(err => res.status(404).json({ nofoodsfound: 'No foods found with the specified ingredient parameter(s)' }));
  })
  .catch(err => console.log(`There was an error: ${err}`))
  
});

module.exports = router;