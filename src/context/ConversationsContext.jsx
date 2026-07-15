import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as api from "../services/api.js";

const ConversationsContext = createContext(null);

function makeLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ConversationsProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState(null);

  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState(null);

  const abortRef = useRef(null);
  const activeIdRef = useRef(null);
  activeIdRef.current = activeId;

  const refreshList = useCallback(async () => {
    try {
      const data = await api.fetchConversations();
      setConversations(data);
      setListError(null);
    } catch (err) {
      setListError(err.message);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const selectConversation = useCallback(async (id) => {
    if (isSending) abortRef.current?.abort();
    setActiveId(id);
    setChatError(null);
    setIsLoadingMessages(true);
    try {
      const data = await api.fetchConversation(id);
      if (activeIdRef.current !== id) return; // user navigated away meanwhile
      setMessages(data.messages);
    } catch (err) {
      setChatError(err.message);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [isSending]);

  const startNewConversation = useCallback(() => {
    if (isSending) abortRef.current?.abort();
    setActiveId(null);
    setMessages([]);
    setChatError(null);
  }, [isSending]);

  const removeConversation = useCallback(
    async (id) => {
      try {
        await api.deleteConversation(id);
      } catch (err) {
        setListError(err.message);
        return;
      }
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (id === activeIdRef.current) {
        setActiveId(null);
        setMessages([]);
      }
    },
    []
  );

  const renameConversationTitle = useCallback(async (id, title) => {
    try {
      const updated = await api.renameConversation(id, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: updated.title } : c))
      );
    } catch (err) {
      setListError(err.message);
    }
  }, []);

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(async (rawText) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    setChatError(null);
    const userMsg = { id: makeLocalId("user"), role: "user", text, createdAt: Date.now() };
    const streamingId = makeLocalId("model");
    const assistantMsg = {
      id: streamingId,
      role: "model",
      text: "",
      createdAt: Date.now(),
      streaming: true,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const conversationIdAtSend = activeIdRef.current;

    let sawFirstMeta = false;

    try {
      await api.streamChat(
        { message: text, conversationId: conversationIdAtSend },
        {
          onMeta: ({ conversationId, title }) => {
            sawFirstMeta = true;
            setActiveId(conversationId);
            activeIdRef.current = conversationId;
            setConversations((prev) => [
              { id: conversationId, title, updatedAt: Date.now(), createdAt: Date.now(), preview: text },
              ...prev,
            ]);
          },
          onChunk: (piece) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === streamingId ? { ...m, text: m.text + piece } : m))
            );
          },
          onDone: ({ conversationId, fullText }) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamingId ? { ...m, text: fullText, streaming: false } : m
              )
            );
            setConversations((prev) => {
              const idx = prev.findIndex((c) => c.id === conversationId);
              if (idx === -1) return prev;
              const updated = {
                ...prev[idx],
                updatedAt: Date.now(),
                preview: fullText.slice(0, 120),
              };
              const rest = prev.filter((c) => c.id !== conversationId);
              return [updated, ...rest];
            });
          },
          onError: (message) => {
            setChatError(message);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamingId ? { ...m, streaming: false, error: true } : m
              )
            );
          },
        },
        controller.signal
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        setChatError(err.message);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, streaming: false, error: true, text: m.text || "" }
              : m
          )
        );
      }
    } finally {
      setIsSending(false);
      abortRef.current = null;
      // Safety net: if neither onDone nor onError fired (e.g. the request
      // was stopped via "Stop generating"), the placeholder message would
      // otherwise be stuck showing a blinking cursor forever.
      setMessages((prev) =>
        prev.map((m) => (m.id === streamingId && m.streaming ? { ...m, streaming: false } : m))
      );
      if (!sawFirstMeta) {
        // Existing conversation: refresh list so ordering/timestamps stay accurate.
        refreshList();
      }
    }
  }, [isSending, refreshList]);

  const value = {
    conversations,
    isLoadingList,
    listError,
    activeId,
    messages,
    isLoadingMessages,
    isSending,
    chatError,
    setChatError,
    refreshList,
    selectConversation,
    startNewConversation,
    removeConversation,
    renameConversationTitle,
    sendMessage,
    stopGenerating,
  };

  return (
    <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within a ConversationsProvider");
  return ctx;
}
