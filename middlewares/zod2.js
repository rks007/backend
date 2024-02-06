const express = require("express");

const zod = require("zod");

const app = express();

app.use(express.json());

const loginSchema = zod.object({
    username: zod.string().min(5),
    email: zod.string().email(),
    password: zod.string().min(4)
})

function userValidateMiddleware(req, res, next){
    
    try {//if true
        loginSchema.parse(req.body);
        next();
        return;
    } catch (error) {
        res.status(403).json({
            msg: "Invalid input format",
            errors: error.errors,
        });
    }
}


app.post("/login", userValidateMiddleware, (req, res) => {
    res.json({
        msg: "login succesfully"
    })
})


app.listen(3000);