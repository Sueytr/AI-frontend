import { useEffect, useRef, useState } from "react";
import { PencilIcon, TrashIcon, CheckIcon, CloseIcon } from "./icons.jsx";
import { relativeTime } from "../utils/time.js";

function ConversationItem({ conversation, isActive, index, onSelect, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(conversation.title);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    setDraftTitle(conversation.title);
  }, [conversation.title]);

  const commitRename = () => {
    const trimmed = draftTitle.trim();
    setIsEditing(false);
    if (trimmed && trimmed !== conversation.title) {
      onRename(conversation.id, trimmed);
    } else {
      setDraftTitle(conversation.title);
    }
  };

  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""}`}
      style={{ animationDelay: `${Math.min(index, 10) * 25}ms` }}
      onClick={() => !isEditing && onSelect(conversation.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isEditing) onSelect(conversation.id);
      }}
    >
      <div className="conversation-item-text">
        {isEditing ? (
          <div className="conversation-item-title" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={draftTitle}
              maxLength={80}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setDraftTitle(conversation.title);
                  setIsEditing(false);
                }
              }}
              onBlur={commitRename}
            />
          </div>
        ) : (
          <span className="conversation-item-title">{conversation.title}</span>
        )}
        <span className="conversation-item-time">{relativeTime(conversation.updatedAt)}</span>
      </div>

      {!isEditing && (
        <div className="conversation-item-actions">
          {confirmingDelete ? (
            <>
              <button
                type="button"
                title="Confirm delete"
                className="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conversation.id);
                }}
              >
                <CheckIcon />
              </button>
              <button
                type="button"
                title="Cancel"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingDelete(false);
                }}
              >
                <CloseIcon />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                title="Rename conversation"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                title="Delete conversation"
                className="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingDelete(true);
                }}
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ConversationItem;
