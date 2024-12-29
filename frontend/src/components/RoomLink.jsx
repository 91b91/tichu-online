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
      <div className="room-link-container">
        <p className="room-link-text">
          Others can join using the room name: <strong>{roomName}</strong> or with the link:
        </p>
        <div className="room-link-wrapper">
          <input className="room-link-input" value={roomLink} readOnly />
          <button className="basic-red-button room-link-button" onClick={handleCopy}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
