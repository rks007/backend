const express = require("express");

const app = express();

app.use(express.json());

// Connect to MongoDB using Mongoose
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rishabhkumarsingh94:23UzpdOdVjxaJFKP@cluster0.fc7lnvw.mongodb.net/userappnew")

// Define a Mongoose model for the 'users' collection, it is necessary to define the type of model or form the data will come
const User = mongoose.model('users',{name: String, email: String, password: String});

app.post('/signup', async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user with the given email already exists in the database
    const userExist = await User.findOne({email: username});

    // If the user already exists, return an error response
    if(userExist){
        return res.status(400).json({
            msg: "user already exist"
        })
    }

    // Create a new user instance using the Mongoose model
    const user = new User({
        name: name,
        email: username,
        password: password
    })
    
    // Save the new user to the MongoDB database, this is important step to reflect changes in the actual database
    user.save();

    res.json({
        msg: "user created successfully"
    })
})

app.listen(3000);

