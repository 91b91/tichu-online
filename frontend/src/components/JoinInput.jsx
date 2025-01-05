// JoinInput.jsx
import React, { useState, useEffect } from "react";
import { useQueryParams } from "../hooks/useQueryParams.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "./ErrorMessage.jsx"

export function JoinInput() {
  const { username, setUsername, userId, roomName, setRoomName, joinRoom } = useUser();
  const { queryParams } = useQueryParams();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // State to manage error messages

  // If the user was shared a link, pre-populate the room input
  useEffect(() => {
    const room = queryParams.get("room");
    if (room) {
      setRoomName(room);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedRoomName = roomName.trim();
  
    if (trimmedUsername && trimmedRoomName) {
      setUsername(trimmedUsername);
      setRoomName(trimmedRoomName);
      setError(""); // Clear any previous errors
  
      try {
        // Attempt to join the room
        await joinRoom({
          username: trimmedUsername,
          userId: userId,
          roomName: trimmedRoomName,
        });
  
        // Navigate to the lobby if successful
        navigate(`/lobby`);
      } catch (error) {
        // Handle the error and display the message
        setError(error.message);
      }
    } else {
      setError("Please enter a player name and the room you want to join. If the room doesn't exist, it'll be created.");
    }
  }  

  return (
    <form onSubmit={handleSubmit} className="join-form">
      <div className="join-header">
        <p className="regular-title">Let's play Tichu with friends</p>
        <p className="regular-subtitle">To get started, enter your player name and a game room.</p>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Room name (e.g., fun-1)"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="input-field"
        />
        <p className="muted-text">Other players can join using the same room name on their device</p>
        <button type="submit" className="basic-red-button join-button">Join Room</button>
      </div>
      {error && <ErrorMessage errorText={error} />} {/* Display the error message if it exists */}
    </form>
  );
}