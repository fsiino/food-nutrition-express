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
// http://localhost:5000/api/foods/nutrient=ash&min=0&max=10/nutrient=protein&min=5&max=20
router.get('/*', (req, res) => {
  let queries = [];
  let fieldsets = req.params[0].split('/')
  let parsedSets = fieldsets.map(fieldset => fieldset.split('&'))
  let newFieldsets = [];
  for (let i = 0; i < parsedSets.length; i++) {
    let obj = {};
    for (let j = 0; j < parsedSets[i].length; j++) {
      const pair = parsedSets[i][j].split('=')
      obj[pair[0]] = pair[1]
    }
    newFieldsets.push(obj)
  }

  let promise = new Promise((res, rej) => {
    let queries = newFieldsets.map((newFieldset, idx) => {
      let query = {
        nutrients: {
          $elemMatch: {
            nutrient: "",
            value: {
              $gt: 0,
              $lte: 20
            }
          }
        }
      };
      query.nutrients.$elemMatch.nutrient = newFieldset.nutrient
      query.nutrients.$elemMatch.value.$gt = newFieldset.min;
      query.nutrients.$elemMatch.value.$lte = newFieldset.max;
      return query;
  })
  res(queries)
})
  promise.then(queries => {
    console.log(queries)
    console.log(JSON.stringify(queries,null,2))
    Food.find({
      $and: queries
    })
      .sort({ name: 1 })
      .then(foods => res.json(foods))
      .catch(err => res.status(404).json({ nofoodsfound: 'No foods found with the specified ingredient parameter(s)' }));
  })
  .catch(err => console.log(err))
  
});

module.exports = router;