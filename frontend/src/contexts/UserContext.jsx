import React, { createContext, useState, useContext } from "react";
import { useSocket } from "../hooks/useSocket";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");

  // Use useSocket to connect to the backend
  const { messages, sendMessage, joinRoom } = useSocket("http://localhost:3500");

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
      roomName,
      setRoomName,
      messages,
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
