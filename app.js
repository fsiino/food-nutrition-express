const express = require('express');
const app = express();
const db = require('./config/keys').mongoURI
const mongoose = require('mongoose');



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));