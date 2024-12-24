import React from "react";
import { ChatInput } from "../components/ChatInput";
import { ChatDisplay } from "../components/ChatDisplay";
import { RoomLink } from "../components/RoomLink";
import { PlayerList } from "../components/PlayerList";

function LobbyPage() {

  return (
    <div>
      <ChatDisplay /> {/* Display chat messages */}
      <ChatInput />   {/* Input toxw send messages */}
      <RoomLink />
      <PlayerList />
    </div>
  );
}

export default LobbyPage;
