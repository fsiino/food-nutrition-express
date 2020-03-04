const express = require('express');
const app = express();
const db = require('./config/keys').mongoURI
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const foods = require('./routes/api/foods');
const food_search = require('./routes/api/food_search');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send("Hello World"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/foods', foods);
app.use('/api/food_search', food_search);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));