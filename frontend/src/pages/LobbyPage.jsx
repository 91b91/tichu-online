import { useState } from "react";
import { ChatInput } from "../components/ChatInput";
import { ChatDisplay } from "../components/ChatDisplay";
import { RoomLink } from "../components/RoomLink";
import { PlayerList } from "../components/PlayerList";
import { useUser } from "../contexts/UserContext";
import { ErrorMessage } from "../components/ErrorMessage";

function LobbyPage() {
  const { roomName, userList, startGameInRoom, currentUser } = useUser();
  const [error, setError] = useState("");

  async function handleStartGame() { 

    try {
      if (!currentUser?.isPartyLeader) {
        throw new Error('Only party leaders can start a game.')
      }

      await startGameInRoom(roomName);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  }

  return (
    <div>
      <div className="basic-container lobby-container">
        <p className="regular-title">Welcome to <strong>{roomName}</strong> </p>
        <RoomLink />
        <PlayerList />
        <button onClick={handleStartGame} className="basic-red-button">Start Game</button>
        {error && <ErrorMessage errorText={error}/>}
      </div>
      <div className="basic-container chat-container"> 
        <ChatDisplay /> 
        <ChatInput />  
      </div>
      
    </div>
  );
}

export default LobbyPage;
