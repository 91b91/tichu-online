import { useState, useEffect } from 'react';
import { useQueryParams } from '../hooks/useQueryParams.jsx';

export function JoinInput({ username, roomName, setUsername, setRoomName, onJoinRoom }) {
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const { queryParams } = useQueryParams();

  useEffect(() => {
    const room = queryParams.get('room');
    if (room) {
      setRoomName(room);
    }
  }, [queryParams, setRoomName]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedRoomName = roomName.trim();
  
    if (trimmedUsername && trimmedRoomName) {
      setUsername(trimmedUsername);
      setRoomName(trimmedRoomName);
      onJoinRoom({ username: trimmedUsername, roomName: trimmedRoomName });
    }
    setHasJoinedRoom(true);
  }

  if (hasJoinedRoom) {
    return false;
  }

  return (
    <form onSubmit={handleSubmit}>
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
          placeholder="Room name (ex: fun-1)"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button type="submit">Play Yahtzee</button>
      </div>
    </form>
  )
}