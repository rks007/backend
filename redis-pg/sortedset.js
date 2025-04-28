/*
A Redis sorted set is a collection of unique strings (members) ordered by an associated score. When more than one string has the same score, the strings are ordered lexicographically. Some use cases for sorted sets include:

Leaderboards. For example, you can use sorted sets to easily maintain ordered lists of the highest scores in a massive online game.
Rate limiters. In particular, you can use a sorted set to build a sliding-window rate limiter to prevent excessive API requests.
*/

const client = require("./client");

async function init() {
    
}

init();