import { useEffect, useRef, useState } from "react";
import { useConversations } from "../context/ConversationsContext.jsx";
import TopBar from "./TopBar.jsx";
import MessageList from "./MessageList.jsx";
import EmptyState from "./EmptyState.jsx";
import Composer from "./Composer.jsx";
import { AlertIcon } from "./icons.jsx";
import { speakText } from "../hooks/useSpeechSynthesis.js";

const VOICE_REPLY_KEY = "ai-chatbot-voice-reply";

function ChatPanel({ onOpenSidebar }) {
  const {
    conversations,
    activeId,
    messages,
    isLoadingMessages,
    isSending,
    chatError,
    setChatError,
    sendMessage,
    stopGenerating,
    renameConversationTitle,
  } = useConversations();

  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(
    () => window.localStorage.getItem(VOICE_REPLY_KEY) !== "off"
  );
  const prevMessagesRef = useRef([]);

  useEffect(() => {
    window.localStorage.setItem(VOICE_REPLY_KEY, voiceReplyEnabled ? "on" : "off");
  }, [voiceReplyEnabled]);

  // Speak a reply the moment it finishes streaming (transition true -> false
  // on the same message id) so we never re-speak history loaded from disk.
  useEffect(() => {
    const prevById = new Map(prevMessagesRef.current.map((m) => [m.id, m]));
    for (const message of messages) {
      const prev = prevById.get(message.id);
      const justFinished = prev?.streaming && !message.streaming;
      if (justFinished && message.role === "model" && !message.error && voiceReplyEnabled) {
        speakText(message.text);
      }
    }
    prevMessagesRef.current = messages;
  }, [messages, voiceReplyEnabled]);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const title = activeConversation?.title ?? "";

  const handleRename = activeId
    ? (newTitle) => renameConversationTitle(activeId, newTitle)
    : undefined;

  return (
    <div className="app-main">
      <TopBar
        title={title}
        onOpenSidebar={onOpenSidebar}
        onRename={handleRename}
        voiceReplyEnabled={voiceReplyEnabled}
        onToggleVoiceReply={() => setVoiceReplyEnabled((v) => !v)}
      />

      {messages.length === 0 && !isLoadingMessages ? (
        <EmptyState onSuggestion={(text) => sendMessage(text)} />
      ) : (
        <MessageList messages={messages} isLoading={isLoadingMessages} />
      )}

      {chatError && (
        <div className="composer-wrap" style={{ paddingBottom: 0 }}>
          <div className="error-banner">
            <AlertIcon />
            <span>{chatError}</span>
            <button type="button" onClick={() => setChatError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <Composer onSend={sendMessage} isSending={isSending} onStop={stopGenerating} />
    </div>
  );
}

export default ChatPanel;
