import React, { useEffect } from "react";
import { useQueryParams } from "../hooks/useQueryParams.jsx";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export function JoinInput() {
  const { username, setUsername, roomName, setRoomName, joinRoom } = useUser();
  const { queryParams } = useQueryParams();
  const navigate = useNavigate();

  // If the user was shared a link, pre-populate the room input
  useEffect(() => {
    const room = queryParams.get("room");
    if (room) {
      setRoomName(room);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedRoomName = roomName.trim();

    if (trimmedUsername && trimmedRoomName) {
      setUsername(trimmedUsername);
      setRoomName(trimmedRoomName);

      // Join the room via socket
      joinRoom({ username: trimmedUsername, roomName: trimmedRoomName });

      // Navigate to the RoomPage
      navigate(`/lobby`);
    } else {
      alert("Both username and room name are required!");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p>Let's play Tichu with friends</p>
        <p>To get started, enter your player name and a game room.</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Room name (e.g., fun-1)"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button type="submit">Play Tichu</button>
      </div>
    </form>
  );
}