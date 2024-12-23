import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { JoinInput } from "../components/JoinInput";

function HomePage() {
  const { username, setUsername, roomName, setRoomName } = useUser(); // Access context
  const navigate = useNavigate(); // For navigation

  const handleJoinRoom = () => {
    if (username && roomName) {
      navigate("/lobby"); // Navigate to the RoomPage
    } else {
      alert("Please enter both a username and a room name.");
    }
  };

  return (
    <div>
      <JoinInput
        username={username}
        roomName={roomName}
        setUsername={setUsername}
        setRoomName={setRoomName}
        onJoinRoom={handleJoinRoom}
      />
    </div>
  );
}

export default HomePage;
