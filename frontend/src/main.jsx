import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

/* ── Initialize theme ──────────────────────────────────────── */
const savedTheme = localStorage.getItem("sv_theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", background: "white", zIndex: 9999, position: "fixed", inset: 0 }}>
          <h1>Something went wrong.</h1>
          <pre style={{ color: "black", whiteSpace: "pre-wrap" }}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ color: "black", whiteSpace: "pre-wrap" }}>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
