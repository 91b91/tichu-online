import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useSocket } from "../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [roomName, setRoomName] = useState("");
  const { messages, userList, sendMessage, joinRoom, updateUsersTeam, startGameInRoom, playSelectedCards, playStack, callTichu } = useSocket("http://localhost:3500");

  // Generate a unique user ID on mount
  useEffect(() => {
    const uuid = uuidv4();
    setUserId(uuid);
    console.log(uuid);
  }, []);

  // Derive the current user from the userList based on userId
  const currentUser = useMemo(() => {
    return userList.find(user => user.userId === userId) || null;
  }, [userList, userId]);

  const value = {
    username,
    setUsername,
    userId,
    setUserId,
    roomName,
    setRoomName,
    messages,
    userList,
    sendMessage,
    joinRoom,
    updateUsersTeam,
    startGameInRoom,
    currentUser,
    playSelectedCards,
    playStack,
    callTichu,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
