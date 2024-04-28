const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('everybody is doing fine')
})

module.exports = router;