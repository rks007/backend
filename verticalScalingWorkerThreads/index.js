import express from "express"
import {Worker} from "worker_threads"

const app = express();


app.get("/compute/:n", (req, res) => {
    const n = parseInt(req.params.n);

    const sum = 0;

    // Create a worker thread
    const worker = new Worker('./compute-worker.js', { // passing the file from where your worker_thread code is written
        workerData: {  // passing the data to the worker
            number: n
        }
    })

    console.log("this is to print before the worker completes its work, which will prove that worker thread spawn another thread and it not block the main thread");
    

    // now listen for the result from the worker
    worker.on("message", (result) => {
        
        res.status(201).json({
            sum: result,
            message: "completed using worker thread"
        })

    })


    // error handling for the workers
    worker.on("error", (error) => {
        res.status(500).json({ error: error.message });
    })

})



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`The app is listening on the port ${PORT}`);
})