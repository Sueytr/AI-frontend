import { useEffect, useRef, useState } from "react";
import { MenuIcon, SparkIcon } from "./icons.jsx";

function VolumeIcon({ on }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {on && <path d="M17.5 8.5a5 5 0 0 1 0 7" />}
      {!on && <path d="m18 9-4 4M14 9l4 4" />}
    </svg>
  );
}

function TopBar({ title, onOpenSidebar, onRename, voiceReplyEnabled, onToggleVoiceReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(title);
  }, [title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title && onRename) {
      onRename(trimmed);
    } else {
      setDraft(title);
    }
  };

  return (
    <header className="topbar">
      <button className="hamburger-btn" onClick={onOpenSidebar} aria-label="Open sidebar">
        <MenuIcon />
      </button>

      <div className="topbar-title-wrap">
        {isEditing ? (
          <input
            ref={inputRef}
            className="topbar-title-input"
            value={draft}
            maxLength={80}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(title);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <h1
            className="topbar-title"
            onClick={() => onRename && setIsEditing(true)}
            title={onRename ? "Click to rename" : undefined}
          >
            {title || (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <SparkIcon size={14} /> New chat
              </span>
            )}
          </h1>
        )}
      </div>

      <div className="topbar-actions">
        <button
          className={`icon-btn ${voiceReplyEnabled ? "active" : ""}`}
          onClick={onToggleVoiceReply}
          aria-pressed={voiceReplyEnabled}
          title={voiceReplyEnabled ? "Voice replies on" : "Voice replies off"}
        >
          <VolumeIcon on={voiceReplyEnabled} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
