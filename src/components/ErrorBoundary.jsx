import { Component } from "react";
import { AlertIcon, SparkIcon } from "./icons.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ height: "100vh" }}>
          <SparkIcon size={36} className="spark-icon-lg" />
          <h2>
            <AlertIcon /> Something went wrong
          </h2>
          <p>The app hit an unexpected error. Reloading usually fixes it.</p>
          <button className="new-chat-btn" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
