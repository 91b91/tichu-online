// useSocket.js
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryParams } from './useQueryParams.jsx';
import { useNavigate } from "react-router-dom";

export function useSocket(url) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [playStack, setPlayStack] = useState([]);
  const {setQueryParams} = useQueryParams();
  const navigate = useNavigate();

  useEffect(() => {
    const socketInstance = io(url);
    setSocket(socketInstance);

    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketInstance.on('userList', ({ users }) => {
      setUserList(users);
    })

    socketInstance.on('playStack', (playStack) => {
      setPlayStack(playStack);
    });

    socketInstance.on("startGameSuccess", () => {
      console.log("Game started successfully. Navigating to game...");
      navigate("/game"); // Navigate to the game page
    });

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
  
        socket.once("roomJoinSuccess", () => {
          resolve(); // Resolve the promise on success
        });
      } else {
        reject(new Error("Socket not initialized."));
      }
    });
  }

  function updateUsersTeam(userId, newTeam) {
    if (socket && newTeam) {
      socket.emit('updateUsersTeam', {userId, team: newTeam})
    }
  }

  function startGameInRoom(roomId) {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit('startGameRequest', ({ roomId }))

        // Listen for success or error
        socket.once("startGameError", (errorMessage) => {
          reject(new Error(errorMessage));
        });

        socket.once("startGameSuccess", () => {
          resolve();
        })
      } else {
        reject(new Error("Socket not initialized."));
      }
    })
  }

  function playSelectedCards(userId, selectedCards) {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit("playSelectedCardsRequest", ({userId, selectedCards}))

        socket.once("playSelectedCardsError", (errorMessage) => {
          reject(new Error(errorMessage));
        });

        socket.once("playSelectedCardsSuccess", () => {
          resolve();
        })
      } else {
        reject(new Error("Socket not initialized."));
      }
    })
  }

  function callTichu(userId) {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit("callTichuRequest", ({ userId }));

        socket.once("callTichuError", (errorMessage) => {
          reject(new Error(errorMessage));
        })

        socket.once("callTichuSuccess", () => {
          resolve();
        });
      } else {
        reject(new Error("Socket not initialized."));
      }
    })
  }

  function updateUserProgress(userId, userProgress) {
    if (socket) {
      socket.emit("updateUserProgressRequest", ({userId, userProgress}))

      socket.once("updateUserProgressError", (errorMessage) => {
        reject(new Error(errorMessage));
      });

      socket.once("updateUserProgressSuccess", () => {
        resolve();
      })
    } else {
      reject(new Error("Socket not initialized."));
    }
  }

  function flipCards(userId) {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit("flipCardsRequest", ({ userId }));

        socket.once("flipCardsError", (errorMessage) => {
          reject(new Error(errorMessage));
        })

        socket.once("flipCardsSuccess", () => {
          resolve();
        });
      } else {
        reject(new Error("Socket not initialized."));
      }
    })
  }

  return { messages, userList, sendMessage, joinRoom, updateUsersTeam, startGameInRoom, playSelectedCards, playStack, callTichu, updateUserProgress, flipCards };
}
