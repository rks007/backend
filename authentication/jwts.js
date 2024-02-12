const jwt = require("jsonwebtoken");

//decode , verify , sign

const value = {
    name: "rishabh",
    password: 12345
}

const token = jwt.sign(value, "secret");
//this token has been generated using this secret, hence this token can only be verified using this secret


//verifying the token
const ver = jwt.verify(token,"secret");

console.log(ver);