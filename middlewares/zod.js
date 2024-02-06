const express = require("express");

const zod = require("zod");

const app = express();

app.use(express.json());

const schema = zod.array(zod.number());

app.post('/health-checkup', (req,res) => {
    const kidneys = req.body.kidneys;//it will take number array
    const response = schema.safeParse(kidneys);
    if(!response.success){
        res.status(411).send({
            response
        })
    }else{
        res.send("your have " + kidneys.length + " kidneys")
    }
})


app.listen(3000);