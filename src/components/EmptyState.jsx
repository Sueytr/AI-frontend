import { SparkIcon } from "./icons.jsx";

const SUGGESTIONS = [
  "Explain this concept like I'm new to it",
  "Help me outline an email to my professor",
  "Give me 5 ideas for a class project",
  "Summarize a long article for me",
];

function EmptyState({ onSuggestion }) {
  return (
    <div className="empty-state">
      <SparkIcon size={40} className="spark-icon-lg" />
      <h2>How can I help today?</h2>
      <p>
        Ask a question by typing or by voice — replies stream in as they're generated, and every
        conversation is saved to your history.
      </p>
      <div className="suggestion-grid">
        {SUGGESTIONS.map((text) => (
          <button key={text} className="suggestion-chip" onClick={() => onSuggestion(text)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;
