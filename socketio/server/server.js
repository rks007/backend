const { createServer } = require('http')

const {Server} = require('socket.io')

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    }
});

let playerScores = [];

io.on('connection', (socket) => {
    // console.log(socket);
    
    socket.on("scores", (scores) => {
        playerScores.push({...scores, id: socket.id})
        console.log(playerScores)

        // console.log(socket.id)

        socket.emit("playerScores", playerScores)
    })
})



httpServer.listen(3000, () => {
    console.log("server is listening on port 3000");  
})

