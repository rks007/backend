const express = require('express');

const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const studentRoutes = require('./routes/studentRoutes');

app.use('/student', studentRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})