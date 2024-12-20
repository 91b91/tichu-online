export function ChatInput({ message, setMessage, onSendMessage }) {

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      setMessage(trimmedMessage);
      onSendMessage(trimmedMessage);
    }
    setMessage('');
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        id="message"
        type="text"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}