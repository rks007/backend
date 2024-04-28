const express = require('express');
const router = express.Router();//Router a given feature of express to handle and manage routes

router.get('/', (req, res) => {
    res.send("hi there")
})

module.exports = router