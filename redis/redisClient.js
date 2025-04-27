const redis = require('redis');

const client = redis.createClient({
    username: 'default',
    password: 'O3pixcQI0h3iG9tdMvPmNXqQy4PQQYqt',
    socket: {
        host: 'redis-19042.c14.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 19042
    }
});
client.connect().then(() => {
    console.log("Connected to Redis");
}).catch((err) => {
    console.log("Error connecting to Redis", err);
});

module.exports = client;