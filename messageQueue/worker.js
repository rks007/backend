const {Worker} = require("bullmq");


// Define Redis connection options explicitly
const connection = {
  host: '127.0.0.1',
  port: 6379,
};

// Create a new worker that processes jobs from the "email-queue"
const worker = new Worker("email-queue", async (job) => {
    console.log(`Message received: ${job.id}`);
    console.log(`Processing job: ${job.id}`);   
    console.log(`Sending Email to: ${job.data.email}`);

    // Simulate 5 seconds delay
    await new Promise((res, rej) => setTimeout(() => res(), 5 * 1000))

    console.log(`Email sent to: ${job.data.email}`);
    
}, { connection});


