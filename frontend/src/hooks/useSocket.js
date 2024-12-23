import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryParams } from './useQueryParams.jsx';
import { useUserId } from './useUserId'; // Import the custom hook for UUID

export function useSocket(url) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const { setQueryParams } = useQueryParams();
  const userId = useUserId(); // Get the UUID for the user

  useEffect(() => {
    // Initialize the socket with the UUID as part of the query params
    const socketInstance = io(url, {
      query: { uuid: userId }, // Pass UUID to the backend
    });

    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url, userId]);

  function sendMessage(username, message, tag) {
    if (socket && message) {
      socket.emit('message', {
        tag: tag,
        name: username,
        text: message,
      });
    }
  }

  function joinRoom({ username, roomName }) {
    if (username && roomName) {
      console.log(`User ${username} with UUID ${userId} wants to join ${roomName}`);
      socket.emit('enterRoom', {
        name: username,
        room: roomName,
        uuid: userId, // Include UUID in joinRoom
      });
  
      setQueryParams({ room: roomName });
    }
  }

  return { messages, sendMessage, joinRoom };
}
