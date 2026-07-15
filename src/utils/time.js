/** Formats a millisecond timestamp as a short, human-friendly relative label. */
export function relativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: timestamp < Date.now() - 365 * 24 * 60 * 60 * 1000 ? "numeric" : undefined,
  });
}

/** Formats a millisecond timestamp as a short clock time, e.g. "3:41 PM". */
export function clockTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
