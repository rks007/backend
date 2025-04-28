const client = require("./client");

async function init() {
    await client.hset("bike:1", {"model": "Ducati", "year": 2020, "color": "red"}); //adding a single value to the hash
    const singleValue = await client.hget("bike:1", "model"); //getting a single value from the hash
    console.log("singleValue ->", singleValue); //this will return the value of the key "model" in the hash "bike:1"
    const allValues = await client.hgetall("bike:1"); //getting all the values from the hash
    console.log("allValues ->", allValues); //this will return all the values in the hash "bike:1"
}

init();