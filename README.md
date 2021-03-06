# Food Nutrition App

### Live Link
<a href="https://murmuring-river-71654.herokuapp.com/" target="_blank">https://murmuring-river-71654.herokuapp.com/</a>

<img src="https://github.com/fsiino/food-nutrition-express/blob/master/docs/fn-main.png?raw=true" width="800px" alt="Screenshot">

## Objective
Create a backend Rest API with an endpoint URL called by the user to find foods containing nutrients within a specified range in grams. Serve the data over a frontend framework with a user-friendly search interface.

## Technologies
* MongoDB
* Express
* React
* Node
* Axios
* RegExp

## Screen GIFs
### Search 
<img src="https://github.com/fsiino/food-nutrition-express/blob/master/docs/fn-search.gif?raw=true" alt="search">

### Fieldset Buttons
<img src="https://github.com/fsiino/food-nutrition-express/blob/master/docs/fn-buttons.gif?raw=true" alt="buttons">

## Code Snippets

```js
// client/components/Form.jsx
const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);
  let query = '';
  const fieldsetsCopy = fieldsets;
  for (let i = 0; i < fieldsetsCopy.length; i++) {
    const fieldsetCopy = fieldsetsCopy[i];
    let nutrient = fieldsetCopy.nutrient.toLowerCase();
    let min = fieldsetCopy.min;
    let max = fieldsetCopy.max;
    if (!nutrient) continue; 
    if (!min) min = 0;
    if (!max) max = 99999; 
    query += `nutrient=${fieldsetsCopy[i].nutrient.toLowerCase()}&min=${fieldsetsCopy[i].min}&max=${fieldsetsCopy[i].max}/`
  }  
  axios.get(`/api/foods/search/${query}`)
    .then(res => {
      if (res.data.length > 0) {
        setResults(res.data);
        setLoading(false);
      } else {
        setResults([]);
        setLoading(false);
        setNotFound(true);
      }
    })
    .catch(err => setErrors(err));
};
```
Originally, each `nutrient`, `min`, and `max` row `fieldset` was a separate GET request whose result(s) were concatenated and updated in the `Form` component's local state to be displayed. Because this proved to be inefficient and less scalable, the backend routes were revised to allow chained search parameters in a single search. The frontend `handleSubmit` function was then rewritten accordingly, taking the axios calls out of the loop and instead making a single call with a finalized url.

```js
// routes/api/food.js
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
        nutrients: { $elemMatch: { nutrient: "", value: { $gt: 0, $lte: 99999 } } }
      };
      query.nutrients.$elemMatch.nutrient = new RegExp(["", newFieldset.nutrient, ""].join(""), "i");
      query.nutrients.$elemMatch.value.$gt = parseFloat(newFieldset.min);
      query.nutrients.$elemMatch.value.$lte = parseFloat(newFieldset.max);
      return query;
    })
    return Promise.resolve(queries);
  }
  parseQuery().then(queries => { // ...
```
Each time a user performs a search, the data is fetched on the backend using the `/search/*` route with a wildcard, according to their specified search parameters. This gives the flexibility to build up a chained query string should the user input more than one nutrient fieldset. Because of the need to perform an O(N^2) operation to format user inputs, the `parseQuery` function returns a resolved promise sending its result to the database. 

