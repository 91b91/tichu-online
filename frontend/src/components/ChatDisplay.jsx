import React from "react";
import { useUser } from "../contexts/UserContext";

export function ChatDisplay() {
  const { messages } = useUser(); // Access messages from socket

  return (
    <ul>
      {messages.map((data, index) => (
        <Message key={index} data={data} />
      ))}
    </ul>
  );
}

function Message({ data }) {
  // Function to process text and replace **<words>** with <strong>words</strong>
  function processText(text) {
    const parts = text.split(/(\*\*.*?\*\*)/);
    
    return parts.map((part, index) =>
      part.startsWith("**") && part.endsWith("**") 
      ? (<strong key={index}>{part.slice(2, -2)}</strong>) // Bold text
      : (part) // Plain text
    );
  };

  return (
    <li>
      <strong>
        {`${data.tag} `}
        {data.name ? `${data.name} ` : ''}
      </strong>
      {processText(`${data.text}`)}
    </li>
  );
}
