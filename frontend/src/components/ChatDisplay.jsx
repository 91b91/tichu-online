import React, { useEffect, useRef } from "react";
import { useUser } from "../contexts/UserContext";

export function ChatDisplay() {
  const { messages } = useUser(); // Access messages from socket
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-display" ref={containerRef}>
      <ul className="chat-messages">
        {messages.map((data, index) => (
          <Message key={index} data={data} />
        ))}
      </ul>
    </div>
  );
}

function Message({ data }) {
  // Function to process text and replace **<words>** with <strong>words</strong>
  function processText(text) {
    const parts = text.split(/(\*\*.*?\*\*)/);

    return parts.map((part, index) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={index}>{part.slice(2, -2)}</strong> // Bold text
        : part // Plain text
    );
  }

  return (
    <li className="chat-message">
      <span className="chat-message-header">
        <span className="chat-message-tag">{data.tag}</span>
        {data.name && (
          <span className="chat-message-name"> {data.name}:</span>
        )}
      </span>
      <span className={data.tag === '[CHAT]' 
        ? 'chat-message-body-dull'
        : 'chat-message-body-regular'}>
        {processText(data.text)}
      </span>
    </li>
  );
}

