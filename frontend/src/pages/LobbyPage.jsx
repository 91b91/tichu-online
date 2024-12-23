import React from "react";
import { useUser } from "../contexts/UserContext";
import { ChatInput } from "../components/ChatInput";
import { ChatDisplay } from "../components/ChatDisplay";
import { RoomLink } from "../components/RoomLink";

function LobbyPage() {
  const { username, roomName } = useUser();

  return (
    <div>
      <ChatDisplay /> {/* Display chat messages */}
      <ChatInput />   {/* Input to send messages */}
      <RoomLink />
    </div>
  );
}

export default LobbyPage;
