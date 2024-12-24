import React, { createContext, useState, useContext, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    let uuid = localStorage.getItem('userId')
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem('userId', uuid);
    }
    setUserId(uuid);
    console.log(uuid);
  }, [])

  // Use useSocket to connect to the backend
  const { messages, userList, sendMessage, joinRoom } = useSocket("http://localhost:3500");

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
      userId,
      setUserId,
      roomName,
      setRoomName,
      messages,
      userList,
      sendMessage,
      joinRoom
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
