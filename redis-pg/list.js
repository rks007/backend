const client = require('./client');

async function init() {
    await client.rpush("messages", "bye from nodejs");
    //await client.expire("messages", 10); //we cannot set expiration directly while pushing to list just like we do in strings. So we need to set expiration separately.
    const result = await client.rpop("messages");
    console.log("result ->", result);
    //how to get all the elements in the list?
    const allMessages = await client.lrange("messages", 0, -1); //0 to -1 means all the elements in the list, 0 is the first element and -1 is the last element.
    console.log("allMessages ->", allMessages);
    
}

init();