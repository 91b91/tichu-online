import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";

export function ChatInput() {
  const { username, sendMessage } = useUser(); // Access sendMessage from socket
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage) {
      sendMessage(username, message, '[CHAT]'); // Send message via socket
    }
    setMessage(""); // Clear input field
  }

  return (
    <form onSubmit={handleSubmit}>
      <input className="input-field chat-input-field"
        type="text"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  ); 
}
