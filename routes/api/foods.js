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

router.get('/search/*', (req, res) => {
  const parseQuery = () => {
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
            gm: {
              $gt: 0,
              $lte: 99999
            }
          }
        }
      };
      query.nutrients.$elemMatch.nutrient = new RegExp(["", newFieldset.nutrient, ""].join(""), "i");
      query.nutrients.$elemMatch.gm.$gt = parseFloat(newFieldset.min);
      query.nutrients.$elemMatch.gm.$lte = parseFloat(newFieldset.max);
      return query;
    })
    return Promise.resolve(queries);
  }
    parseQuery().then(queries => {
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