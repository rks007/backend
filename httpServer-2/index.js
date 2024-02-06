const express = require("express")

const app = express();

function calculateSum(a, b){
    let ans =  parseInt(a) + parseInt(b);
    return ans;
}

app.get('/', (req, res)=>{
    const a = req.query.a;
    const b = req.query.b;
    let answer = calculateSum(a, b)
    res.send("hi your answer is" + " " + answer)
})

app.listen(3000);