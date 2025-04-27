const Product  = require('../models/product');
const redisClient = require('../redisClient');


const createProduct = async (req, res) => {
    try {   
        const {name, price, description} = req.body;
        console.log(name, price, description);
        const newProduct = await Product.create({
            name,
            price,
            description
        });
        res.status(201).send(newProduct);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

//how to insert data in string format in redis
//how to get data from redis in string format

const getProductById = async (req, res) => {
    try {
        const isproductInCache = await redisClient.get(`product:${req.params.id}`);
        if (isproductInCache) {
            return res.status(200).send(JSON.parse(isproductInCache));
        };
        const product = await Product.findById(req.params.id);
        await redisClient.set(`product:${req.params.id}`, JSON.stringify(product));
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
}

//how to insert data in hash format in redis
//how to get data from redis in hash format

const getProductByName = async (req, res) => {
    try {      
        const productKey = `product:${req.params.name}`;

        // Check if product exists in Redis cache
        const isProductInCache = await redisClient.hGetAll(productKey);
        if (Object.keys(isProductInCache).length > 0) {
            return res.status(200).json(isProductInCache);
        }    
 

        const product = await Product.findOne({
            name: req.params.name
        })
        //if not in cache
        const plainProduct = product.toObject();
        const hashdata = {};
        
        // Convert all values to strings (since Redis only stores strings)
        for (const [key, value] of Object.entries(plainProduct)) {
            hashdata[key] = value.toString();
        }
        // Store in Redis
        await redisClient.hSet(productKey, hashdata);
        // Set expiration to 1 hour (3600 seconds)
        await redisClient.expire(productKey, 3600);
        return res.status(200).json(plainProduct);

    } catch (error) {
        return res.status(500).send(`Internal server error: ${error}`);
    }
}

//how to insert data in list format in redis
//how to get data from redis in list format
const getAllProducts = async (req, res) => {
    try {
        // Check if products are in cache
        const cachedProducts = await redisClient.get('products');
        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        // If not in cache, fetch products from MongoDB
        const products = await Product.find();

        // Store in Redis with expiration (1 hour)
        await redisClient.set('products', JSON.stringify(products), { EX: 3600 });

        return res.status(200).json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { createProduct, getProductById, getProductByName, getAllProducts };