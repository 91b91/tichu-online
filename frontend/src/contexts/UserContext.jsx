import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useSocket } from "../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [roomName, setRoomName] = useState("");
  const { messages, userList, sendMessage, joinRoom, updateUsersTeam, startGameInRoom, playSelectedCards, playStack, callTichu, updateUserProgress, flipCards } = useSocket("http://localhost:3500");

  // Generate a unique user ID on mount
  useEffect(() => {
    const uuid = uuidv4();
    setUserId(uuid);
    console.log(uuid);
  }, []);

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
    updateUserProgress,
    flipCards,
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
