import { useRef, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea.js";
import { SendIcon, MicIcon } from "./icons.jsx";

const MAX_LENGTH = 4000;

function Composer({ onSend, isSending, onStop }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  useAutoResizeTextarea(textareaRef, input);

  const handleSend = (text) => {
    const value = (text ?? input).trim();
    if (!value || isSending) return;
    onSend(value);
    setInput("");
  };

  const { startListening, isListening, isSupported } = useSpeechRecognition((transcript) => {
    setInput(transcript);
    handleSend(transcript);
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const nearLimit = input.length > MAX_LENGTH * 0.9;

  return (
    <div className="composer-wrap">
      <div className="composer">
        <button
          type="button"
          className={`composer-btn mic-toggle-btn ${isListening ? "listening" : ""}`}
          onClick={startListening}
          disabled={isSending || !isSupported}
          title={isSupported ? "Speak your message" : "Voice input isn't supported in this browser"}
        >
          <MicIcon />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          maxLength={MAX_LENGTH}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening…" : "Message the assistant…"}
          rows={1}
          disabled={isSending}
        />

        {isSending ? (
          <button type="button" className="composer-btn send-btn" onClick={onStop} title="Stop generating">
            <span style={{ width: 10, height: 10, background: "currentColor", display: "block", borderRadius: 2 }} />
          </button>
        ) : (
          <button
            type="button"
            className="composer-btn send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            title="Send message"
          >
            <SendIcon />
          </button>
        )}
      </div>

      <div className="composer-footer">
        <span>Enter to send · Shift + Enter for a new line</span>
        {input.length > MAX_LENGTH * 0.7 && (
          <span className={`composer-char-count ${nearLimit ? "warn" : ""}`}>
            {input.length}/{MAX_LENGTH}
          </span>
        )}
      </div>
    </div>
  );
}

export default Composer;
