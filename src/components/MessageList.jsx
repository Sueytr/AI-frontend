import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

function MessageList({ messages, isLoading }) {
  const endRef = useRef(null);
  const containerRef = useRef(null);
  const stickToBottomRef = useRef(true);

  // Track whether the user is near the bottom so we only auto-scroll when
  // they haven't intentionally scrolled up to read earlier messages.
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 120;
  };

  useEffect(() => {
    if (stickToBottomRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="message-list" ref={containerRef}>
        <div className="message-list-inner">
          {[0, 1].map((i) => (
            <div className="sidebar-skeleton-row" key={i} style={{ height: 60 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="message-list" ref={containerRef} onScroll={handleScroll}>
      <div className="message-list-inner">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

export default MessageList;
