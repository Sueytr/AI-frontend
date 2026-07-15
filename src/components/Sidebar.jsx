import { useMemo, useState } from "react";
import { useConversations } from "../context/ConversationsContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import ConversationItem from "./ConversationItem.jsx";
import { SparkIcon, PlusIcon, SearchIcon, CloseIcon, SunIcon, MoonIcon } from "./icons.jsx";

function Sidebar({ onNavigate }) {
  const {
    conversations,
    isLoadingList,
    listError,
    activeId,
    startNewConversation,
    selectConversation,
    removeConversation,
    renameConversationTitle,
  } = useConversations();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, query]);

  const handleSelect = (id) => {
    selectConversation(id);
    onNavigate?.();
  };

  const handleNewChat = () => {
    startNewConversation();
    onNavigate?.();
  };

  return (
    <aside className="sidebar" aria-label="Conversation history">
      <div className="sidebar-brand">
        <SparkIcon size={20} />
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">CampusAI</span>
          <span className="sidebar-brand-tag">Assistant</span>
        </div>
        <button className="sidebar-close-btn" onClick={onNavigate} aria-label="Close sidebar">
          <CloseIcon />
        </button>
      </div>

      <button className="new-chat-btn" onClick={handleNewChat}>
        <PlusIcon /> New chat
      </button>

      <div className="sidebar-search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search conversations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search conversations"
        />
      </div>

      <div className="conversation-list">
        {isLoadingList && (
          <div className="sidebar-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="sidebar-skeleton-row" key={i} />
            ))}
          </div>
        )}

        {!isLoadingList && listError && (
          <p className="sidebar-empty">{listError}</p>
        )}

        {!isLoadingList && !listError && filtered.length === 0 && (
          <p className="sidebar-empty">
            {conversations.length === 0
              ? "No conversations yet. Start one below."
              : "No conversations match your search."}
          </p>
        )}

        {!isLoadingList &&
          filtered.map((conversation, index) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              index={index}
              isActive={conversation.id === activeId}
              onSelect={handleSelect}
              onDelete={removeConversation}
              onRename={renameConversationTitle}
            />
          ))}
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-hint">Gemini · React · Node</span>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
