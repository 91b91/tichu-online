import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryParams } from './useQueryParams.jsx';

export function useSocket(url) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const {setQueryParams} = useQueryParams();
  

  useEffect(() => {
    const socketInstance = io(url);
    setSocket(socketInstance);

    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socketInstance.disconnect();
  }, [url]);

  function sendMessage(message) {
    if (socket && message) {
      socket.emit('message', message);
    }
  }

  function joinRoom({ username, roomName }) {
    if (username && roomName) {
      console.log(`User ${username} with id ${socket.id} wants to join ${roomName}`);
      socket.emit('enterRoom', {
        name: username,
        room: roomName
      })

      setQueryParams({ room: roomName });
    }
  }

  return { messages, sendMessage, joinRoom };
}
