const express = require('express');

const port = 30000;

const app = express();

app.get('/', (req,res) => {
    res.send("hello world");
})

app.post('/coversation', (req, res)=>{ //printing the req.headers
    console.log(req.headers);

    res.send({
        msg: "hello"
    })
})

app.get('/about', (req,res) => {
    res.send("you are in about");
})

app.get('/route', (req, res)=>{
    res.json({
        name : "hello ji",
        age : 12
    })
})

app.listen(port, ()=>{
    console.log(`your app is listening at port ${port}`);
})