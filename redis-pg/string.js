const client = require('./client');

async function init() {
    //await client.set("msg:3", "from nodejs")
    await client.set("msg:3", "from nodejs", "EX", 10); //this will expire in 10 seconds
    const result = await client.get("msg:3");
    console.log("result ->", result);
    
    
}

init();