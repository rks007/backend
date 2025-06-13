const {Queue} = require("bullmq");
// Create a new queue named "email-queue"
// Since we are not passing a `connection` object,
// BullMQ will try to connect to Redis at the default host: "127.0.0.1" and port: 6379
// This works if Redis is running on the host machine using default settings,
// such as when started with: `docker run -d --name redis -p 6379:6379 redis`

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

const notificationQueue = new Queue("email-queue", { connection });


async function init(){
    const result = await notificationQueue.add("email to user", {
        email: "test@mail.com", 
        subject: "Welcome!", 
        body: "Hello, welcome to our service!"
    })
    console.log("Job added to queue:", result.id);
}


init();