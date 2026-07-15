import { useState } from "react";
import MarkdownContent from "./MarkdownContent.jsx";
import { SparkIcon, CopyIcon, CheckIcon, AlertIcon } from "./icons.jsx";
import { clockTime } from "../utils/time.js";

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isEmptyStreaming = message.streaming && !message.text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`message-row ${isUser ? "user" : "model"}`}>
      <div className={`avatar ${isUser ? "user" : "model"}`} aria-hidden="true">
        {isUser ? "You" : <SparkIcon size={15} />}
      </div>

      <div className="message-col">
        <div className="message-meta">
          <span>{isUser ? "You" : "Assistant"}</span>
          {message.createdAt && <span>{clockTime(message.createdAt)}</span>}
        </div>

        <div className={`message-bubble ${message.error ? "error" : ""}`}>
          {message.error && !message.text && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <AlertIcon /> Couldn't get a response. Please try again.
            </span>
          )}

          {isEmptyStreaming ? (
            <div className="typing-indicator" aria-label="Assistant is typing">
              <span />
              <span />
              <span />
            </div>
          ) : isUser ? (
            <span style={{ whiteSpace: "pre-wrap" }}>{message.text}</span>
          ) : (
            <>
              <MarkdownContent text={message.text} />
              {message.streaming && <span className="streaming-caret" aria-hidden="true" />}
            </>
          )}
        </div>

        {!isEmptyStreaming && message.text && (
          <div className="message-actions">
            <button type="button" onClick={handleCopy} title="Copy message">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
