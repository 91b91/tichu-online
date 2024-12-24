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

  function sendMessage(username, message, tag) {
    if (socket && message) {
      socket.emit('message', { 
        tag: tag,
        name: username, 
        text: message
      });
    }
  }

  function joinRoom({ username, userId, roomName}) {
    if (username && roomName) {
      console.log(`User ${username} with id ${socket.id} wants to join ${roomName}`);
      socket.emit('enterRoom', {
        name: username,
        userId: userId,
        room: roomName
      })

      setQueryParams({ room: roomName });
    }
  }

  return { messages, sendMessage, joinRoom };
}
