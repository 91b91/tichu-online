export function ChatDisplay({ messages }) {
  return (
    <ul>
      {messages.map((data, index) => (
        <li key={index}>
          {data}
        </li>
      ))}
    </ul>
  );
}