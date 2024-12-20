import { useSocket } from '../hooks/useSocket';
import { JoinInput } from './JoinInput'
import { ChatInput } from './ChatInput'
import { ChatDisplay } from './ChatDisplay'
import { useState, useEffect } from 'react'

function App() {
  const {messages, sendMessage, joinRoom} = useSocket("http://localhost:3500");
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');

  return (
    <>
      <JoinInput 
        username={username}
        roomName={roomName}
        setUsername={setUsername}
        setRoomName={setRoomName}
        onJoinRoom={joinRoom}
        />
      <ChatInput 
        message={message} 
        setMessage={setMessage} 
        onSendMessage={sendMessage}/>
      <ChatDisplay messages={messages}/>
    </>
  )
}

export default App
