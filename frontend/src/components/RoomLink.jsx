import { useQueryParams } from '../hooks/useQueryParams.jsx';
import { useUser } from "../contexts/UserContext";

export function RoomLink() {
  const { roomName } = useUser();
  const { queryParams, baseUrl } = useQueryParams();

  const homeUrl = new URL('/', baseUrl); 
  const roomLink = `${homeUrl.href}?room=${encodeURIComponent(roomName)}`;

  function handleCopy() {
    navigator.clipboard.writeText(roomLink);
  }

  return (
    <>
      <p>Others can join using the room name: <strong>{roomName}</strong> or with the link:</p>
      <p>{roomLink}</p>
      <button onClick={handleCopy}>
        Copy
      </button>
    </>
  );
}
