const express = require("express");

const app = express();

//function that return a boolean if the age of the person is more than 14
function isAgeEnough(age){
    if(age >= 14){
        return true;
    }
    else{
        return false;
    }
}

function isAgeEnoughMiddleware(req, res, next){
    const age = req.query.age;
    if(age >= 14){
        next();
    }else{
        res.status(411).json({
            msg: "Sorry you are not of the age yet"
        })
    }
}

app.get('/ride1', isAgeEnoughMiddleware, (req, res) => { 
    
    res.json({
        msg: "you have succesfully riden the ride 1"
    })
  
})




app.listen(3000);