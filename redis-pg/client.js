const {Redis} = require('ioredis');

const client = new Redis();

module.exports = client;


/*

1. What happens in this code?

const { Redis } = require('ioredis');
const client = new Redis();
When you do new Redis(), without passing anything, ioredis automatically defaults to:

host = 127.0.0.1 (localhost)

port = 6379

because Redis servers, by default, run locally at localhost:6379 unless configured otherwise.

🔵 It's the same as writing:

const client = new Redis({
    host: '127.0.0.1',
    port: 6379
});
But ioredis is smart enough to assume it when you don't specify anything.

2. How is it connecting?
As soon as you write new Redis(), it creates a TCP connection to localhost on port 6379.

ioredis handles the socket connection internally.

It speaks the Redis protocol (RESP - Redis Serialization Protocol) to communicate with your Redis server.

You can imagine it like this:

Your Node.js app (client)  <-- TCP socket -->  Redis server (running locally on port 6379)
3. If Redis was running somewhere else?
If Redis was running on a different host/port (say AWS Redis or Docker container), you would have to pass it manually:


const client = new Redis({
    host: 'my-redis-server.com',
    port: 6380,
    password: 'yourpassword'
});
or even using a Redis URL:


const client = new Redis('redis://default:password@hostname:port');
🔥 So in short:
new Redis() → defaults to 127.0.0.1:6379

No magic, just default parameters.

TCP connection opens immediately.

*/