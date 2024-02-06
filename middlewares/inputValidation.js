const express = require("express");

const app = express();

app.use(express.json());

app.post("/health-checkup", (req, res) => {
    const kidneys = req.body.kidneys;
    const kidneysLength = kidneys.length;

    res.send("you have " + kidneysLength + " kidneys")
})

//global catches use for wrong inputs
//for handling invalid inputs from the user you can use global catches
//it always declared at the end

app.use((err, req, res, next) => { //it takes a function with four inputs err, req,res and next
    res.json({
        msg: "something wrong with the server"
    })
})

app.listen(3000);