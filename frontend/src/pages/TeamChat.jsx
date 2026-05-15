import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../components/auth/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import OnlineMembers from "../components/chat/OnlineMembers";
import ActivityPanel from "../components/chat/ActivityPanel";
import AppBackground from "../components/AppBackground";
import { fetchChannels, fetchOnlineUsers, fetchActivity } from "../services/chatService";
import "../styles/TeamChat.css";

const TeamChat = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const getInitialChannel = (ch) => ch.length > 0 ? ch[0].name : null;

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [ch, users, act] = await Promise.all([
          fetchChannels(),
          fetchOnlineUsers(),
          fetchActivity()
        ]);
        if (!isMounted) return;
        setChannels(ch);
        setOnlineUsers(users);
        setActivity(act);
        setActiveChannel(prev => prev || getInitialChannel(ch));
        setError(false);
      } catch (err) {
        console.error("Error loading chat data:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  const handleChannelChange = useCallback((channelName) => {
    setActiveChannel(channelName);
    setIsMobileNavOpen(false);
  }, []);

  const refreshActivity = useCallback(async () => {
    try {
      const act = await fetchActivity();
      setActivity(act);
    } catch (err) {
      console.error("Error refreshing activity:", err);
    }
  }, []);

  const refreshOnlineUsers = useCallback(async () => {
    try {
      const users = await fetchOnlineUsers();
      setOnlineUsers(users);
    } catch (err) {
      console.error("Error refreshing online users:", err);
    }
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container teamchat-container">
        <AppBackground />
        <Sidebar activeTab="Team Chat" />
        <main className="teamchat-body">
          <div className="teamchat-inner" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "var(--text-muted)" }}>Loading chat...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container teamchat-container">
        <AppBackground />
        <Sidebar activeTab="Team Chat" />
        <main className="teamchat-body">
          <div className="teamchat-inner" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "var(--text-muted)", textAlign: "center" }}>
              <p>Failed to load chat data.</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: 12 }}>
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container teamchat-container">
      <AppBackground />
      <Sidebar activeTab="Team Chat" />

      <main className="teamchat-body">
        <div className="teamchat-inner">
          <ChatSidebar
            channels={channels}
            activeChannel={activeChannel}
            onChannelChange={handleChannelChange}
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
          />

          <ChatWindow
            key={activeChannel}
            user={user}
            activeChannel={activeChannel}
            onMenuOpen={() => setIsMobileNavOpen(true)}
            onActivityChange={refreshActivity}
          />

          <aside className="team-panel">
            <OnlineMembers users={onlineUsers} />
            <ActivityPanel activities={activity} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TeamChat;
