const express = require("express");

const app = express();

//middleware
function userMiddleware(req, res, next){
    const username = req.get("username");//get is used to pass headers in request
    const password = req.get("password");
    if(username != "admin" && password != "pass"){
        res.status(403).json({
            msg: "Incorrect inputs"
        })
    }else{
        next();//next is use to indicate that please move on to the next function in app.something you have coded
    }
}

//middleware
function kidneyMiddleware(req, res, next){
    const kidneyId = req.query.kidneyId;
    if(kidneyId != 1 && kidneyId != 2){
        res.status(403).json({
            msg: "Incorrect inputs"
        })
    }else{
        next();
    }
}

app.get('/health-checkup', userMiddleware, kidneyMiddleware, (req, res)=>{
    //logic
    res.send("your are fine")
})

app.get("/kidney-checkup", userMiddleware, kidneyMiddleware, (req, res)=>{
    //logic
    res.send("your kidney is healthy")
})

app.listen(3000);