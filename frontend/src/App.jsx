import { useState, useEffect } from 'react'
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socketInstance = io("http://localhost:3500");
    setSocket(socketInstance);

    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socketInstance.disconnect();
  }, []);

  function sendMessage(message) {
    if (socket && message) {
      socket.emit('message', message); 
    }
  }

  return (
    <>
      <ChatInput 
        message={message} 
        setMessage={setMessage} 
        onSendMessage={sendMessage}/>
      <ChatDisplay messages={messages}/>
    </>
  )
}

function ChatInput({ message, setMessage, onSendMessage }) {

  function handleSubmit(e) {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
  }

  return (
    <form className="form-msg" onSubmit={handleSubmit}>
      <input
        id="message"
        type="text"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Send</button>
    </form>
  );
}

function ChatDisplay({ messages }) {
  return (
    <ul>
      {messages.map((data, index) => (
        <li key={index}>
          {data}
        </li>
      ))}
    </ul>
  );
}


export default App
