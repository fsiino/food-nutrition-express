const express = require('express');
const app = express();
const db = require('./config/keys').mongoURI
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const foods = require('./routes/api/foods');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.get('/', (req, res) => res.send("Hello World"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/foods', foods);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));