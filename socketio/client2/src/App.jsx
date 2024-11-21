import io from 'socket.io-client'
import './App.css'
import { useEffect, useState } from 'react'
import Input from './components/Input'

function App() {

  const [score, setScore] = useState({});

  const socket = io("localhost:3000")

  function connectSocket(){
    socket.on("connection", (socket) => {
      console.log(socket)

      
    })
  }

  function handleInput(event){
    const {name, value} = event.target;
    // console.log({ [name]: value }); 
    let currentObj = {[name]: value};
    setScore((prev) => ({...prev, ...currentObj}))   
  }

  function sendScore(){
    console.log(score);
    socket.emit("scores", score);

    socket.on("playerScores", (data) => {
      console.log(data)
    })
  }
  

  useEffect(() => {
    connectSocket();
  }, [])

  return (
    <>
      <h1>React multiplayer dashboard</h1>
      <Input name="playerName" placeholder="Enter your name" handleInput={handleInput}/>
      <Input name="score" placeholder="Enter your score" handleInput={handleInput} />
      <button className='send-scores' onClick={sendScore}>Publish score</button>
    </>
  )
}

export default App
