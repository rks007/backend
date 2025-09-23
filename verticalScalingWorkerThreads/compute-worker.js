import { parentPort, workerData } from "worker_threads"

//get the data that was passed from the worker thread

const { number } = workerData;

let sum = 0;

for(let i = 0; i <= number; i++){
    sum += i;
}

//send the result to the thread back
parentPort.postMessage(sum);