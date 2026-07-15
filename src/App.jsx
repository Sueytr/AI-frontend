import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ConversationsProvider } from "./context/ConversationsContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatPanel from "./components/ChatPanel.jsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <ConversationsProvider>
        <div className={`app-shell ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
          <ChatPanel onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>
      </ConversationsProvider>
    </ThemeProvider>
  );
}

export default App;
