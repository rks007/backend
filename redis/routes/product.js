const express = require('express');
const { createProduct, getProductById, getProductByName, getAllProducts } = require('../controller/Product');

const router = express.Router();

router.post('/create', createProduct);
router.get('/all', getAllProducts)
router.get('/:id', getProductById)
router.get('/name/:name', getProductByName)

module.exports = router;