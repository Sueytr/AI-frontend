// Small, dependency-free inline SVG icons. Kept in one file so the visual
// language (stroke width, corner style) stays consistent across the app.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** The signature mark: a four-point spark/asterisk used as brand, avatar
 * and "thinking" motif throughout the app. */
export function SparkIcon({ size = 18, className }) {
  return (
    <svg
      className={`spark-icon ${className || ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 2c0 4.5 2 8 6 10-4 2-6 5.5-6 10-0-4.5-2-8-6-10 4-2 6-5.5 6-10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 12 20 4l-6 16-3-7-7-1Z" />
    </svg>
  );
}

export function MicIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function PencilIcon(props) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
    </svg>
  );
}

export function CopyIcon(props) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...base} {...props}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function AlertIcon(props) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}
