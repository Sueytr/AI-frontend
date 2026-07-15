import axios from "axios";

// In dev, Vite proxies "/api" to the backend (see vite.config.js), so a
// relative base URL works out of the box and also behind a reverse proxy
// in production. Set VITE_API_BASE_URL to point at a separately-hosted
// backend instead.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

function extractErrorMessage(err, fallback) {
  return err.response?.data?.error || err.message || fallback;
}

export async function fetchConversations() {
  try {
    const { data } = await client.get("/conversations");
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Couldn't load your conversations."));
  }
}

export async function fetchConversation(id) {
  try {
    const { data } = await client.get(`/conversations/${id}`);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Couldn't load that conversation."));
  }
}

export async function renameConversation(id, title) {
  try {
    const { data } = await client.patch(`/conversations/${id}`, { title });
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Couldn't rename that conversation."));
  }
}

export async function deleteConversation(id) {
  try {
    await client.delete(`/conversations/${id}`);
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Couldn't delete that conversation."));
  }
}

/**
 * Sends a chat message and streams the reply back.
 *
 * The backend responds with newline-delimited JSON events. This function
 * reads the response body incrementally (rather than using axios, which
 * buffers the whole response) and invokes `handlers` as events arrive.
 *
 * @param {{ message: string, conversationId?: string }} payload
 * @param {{
 *   onMeta?: (e: { conversationId: string, title: string }) => void,
 *   onChunk?: (text: string) => void,
 *   onDone?: (e: { conversationId: string, fullText: string }) => void,
 *   onError?: (message: string) => void,
 * }} handlers
 * @param {AbortSignal} [signal]
 */
export async function streamChat(payload, handlers, signal) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/chat`;
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") return;
    throw new Error("Couldn't reach the server. Is it running?");
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming isn't supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    let readResult;
    try {
      readResult = await reader.read();
    } catch (err) {
      if (err.name === "AbortError") return;
      throw err;
    }
    const { value, done } = readResult;
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }
      dispatchEvent(event, handlers);
    }
  }

  if (buffer.trim()) {
    try {
      dispatchEvent(JSON.parse(buffer), handlers);
    } catch {
      // ignore trailing partial line
    }
  }
}

function dispatchEvent(event, handlers) {
  switch (event.type) {
    case "meta":
      handlers.onMeta?.(event);
      break;
    case "chunk":
      handlers.onChunk?.(event.text);
      break;
    case "done":
      handlers.onDone?.(event);
      break;
    case "error":
      handlers.onError?.(event.message);
      break;
    default:
      break;
  }
}
