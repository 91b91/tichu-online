import { useQueryParams } from '../hooks/useQueryParams.jsx';
import { DuplicateIcon } from '@heroicons/react/outline';

export function RoomLink() {
  const { queryParams, baseUrl } = useQueryParams();

  const room = queryParams.get('room');
  const roomLink = `${baseUrl}?room=${room}`;

  function handleCopy() {
    navigator.clipboard.writeText(roomLink);
  }

  if (!room) {
    return null;
  }

  return (
    <>
      <p>Others can join using the room name: <strong>{room}</strong> or with the link:</p>
      <p>{roomLink}</p>
      <button onClick={handleCopy}>
        copy
      </button>
    </>
  )
}

