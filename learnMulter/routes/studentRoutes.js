const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        const suffix = Date.now();
        cb(null, suffix + '-' + file.originalname)
    }
})

const upload = multer({storage: storage});

//Route to create a new student
router.post('/create', upload.single('photo'),  async (req, res) => {
    try {
        
        const {name, age, email, phone, address,} = req.body;

        const photopath = req.file ? req.file.path : null; //get the path of the uploaded file

        const newStudent = new Student({
            name,
            age,
            email,
            phone,
            address,
            photo: photopath
        });

        await newStudent.save();
        res.status(201).json({
            message: "Student created successfully",
            student: newStudent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating student record"
        })
        
    }
})

module.exports = router;