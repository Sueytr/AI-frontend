import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.jsx";

const components = {
  code({ className, children, ...rest }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeText = String(children).replace(/\n$/, "");

    // A fenced code block has a "language-*" className from remark; a
    // single-backtick inline code span does not.
    if (match) {
      return <CodeBlock language={match[1]} code={codeText} />;
    }
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  a({ children, ...rest }) {
    return (
      <a target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
};

function MarkdownContent({ text }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
