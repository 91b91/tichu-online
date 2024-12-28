
export function ErrorMessage({ errorText }) {
  return (
    <div className="error-message">
      <p className="error-text">{errorText}</p>
    </div>
  );
}