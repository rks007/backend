const express = require('express');
const axios = require("axios");
const app = express();
const client = require('./client');


app.get('/', async (req, res) => {

    const cachedValue = await client.get("todos");

    if(cachedValue){
        return res.json({todos: JSON.parse(cachedValue)});
    }

    const response = await axios.get("https://jsonplaceholder.typicode.com/todos")

    await client.set("todos", JSON.stringify(response.data), "EX", 20 );//setting the value to expire in 20 seconds

    res.json({todos: response.data})
})




app.listen(9000);
