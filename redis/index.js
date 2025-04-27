const express = require('express');
const app = express();
require('./db');
const client = require('./redisClient')
const routes = require('./routes/index')

const port = 3000;

app.use(express.json());
app.use("/api", routes);


app.get('/', (req, res) => {
    res.send('hi there');
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
})