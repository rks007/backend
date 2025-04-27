/*
A Redis set is an unordered collection of unique strings (members). You can use Redis sets to efficiently:

Track unique items (e.g., track all unique IP addresses accessing a given blog post).
Represent relations (e.g., the set of all users with a given role).
Perform common set operations such as intersection, unions, and differences.
*/

const client = require('./client');

async function init() {
    await client.sadd("ip", "1"); //adding a single value to the set
    await client.sadd("ip", "2", "3", "4"); //adding multiple values to the set
    await client.sadd("ip", "2"); //adding a duplicate value to the set, this will not be added to the set as sets do not allow duplicates.
    await client.srem("ip", "4"); //removing a value from the set
    const result = await client.smembers("ip"); //getting all the members of the set
    console.log("result ->", result); //this will return all the members of the set
    const isMember = await client.sismember("ip", "1"); //checking if a value is a member of the set
    console.log("isMember ->", isMember); //this will return 1 if the value is a member of the set, 0 if it is not a member of the set
    const count = await client.scard("ip"); //getting the count of members in the set
    console.log("count ->", count); //this will return the count of members in the set
}

init();