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
      <input
        type="text"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  ); 
}
