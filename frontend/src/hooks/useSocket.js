// useSocket.js
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryParams } from './useQueryParams.jsx';

export function useSocket(url) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const {setQueryParams} = useQueryParams();
  

  useEffect(() => {
    const socketInstance = io(url);
    setSocket(socketInstance);

    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketInstance.on('userList', ({ users }) => {
      setUserList(users);
    })

    return () => {
      socketInstance.disconnect();
    };
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

  function joinRoom({ username, userId, roomName }) {
    return new Promise((resolve, reject) => {
      if (socket) {
        // Emit the join event
        socket.emit("enterRoom", { name: username, userId, room: roomName });
  
        // Listen for success or error
        socket.once("roomJoinError", (errorMessage) => {
          reject(new Error(errorMessage)); // Reject with the error message
        });
  
        socket.once("joinedRoom", () => {
          resolve(); // Resolve the promise on success
        });
      } else {
        reject(new Error("Socket not initialized."));
      }
    });
  }  

  return { messages, userList, sendMessage, joinRoom };
}
