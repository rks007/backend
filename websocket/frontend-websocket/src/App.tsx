import { useEffect, useState } from "react"


function App() {

  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080')

    socket.onopen = () => {
      console.log("connected");
      setSocket(socket)
      
    }

    socket.onmessage = (message) => {
      console.log("recieved message:", message.data);
      setMessages( (m) => [...m, message.data] )
    }

    return () => {
      socket.close();
    }

  }, [])

  if(!socket){
    return <div>
      Connecting to socket Server....
    </div>
  }

  return (
    <>
      <h1>
        Messages
      </h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </>
  )
}

export default App
