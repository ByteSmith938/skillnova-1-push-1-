import { useState, useEffect, useRef, useCallback } from "react";
import { Phone, Search, Menu } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import { fetchMessages, sendMessage } from "../../services/chatService";

const POLL_INTERVAL = 5000;

const ChatWindow = ({ user, activeChannel, onMenuOpen, onActivityChange }) => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!activeChannel) return;
    try {
      const data = await fetchMessages(activeChannel);
      setMessages(data.reverse());
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  }, [activeChannel]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeChannel) {
        fetchMessages(activeChannel).then(data => {
          setMessages(data.reverse());
        }).catch(() => {});
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [activeChannel]);

  const handleSend = async (text) => {
    if (!activeChannel || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage(activeChannel, text);
      setMessages(prev => [...prev, msg]);
      if (onActivityChange) onActivityChange();
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const channelLabel = activeChannel
    ? "# " + activeChannel.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "";

  const channelDesc = activeChannel
    ? activeChannel.replace(/-/g, " ")
    : "";

  if (!activeChannel) {
    return (
      <div className="chat-window">
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          Select a channel to start chatting
        </div>
      </div>
    );
  }

  const groupByDate = (msgs) => {
    const groups = [];
    let currentDate = null;
    for (const msg of msgs) {
      const d = new Date(msg.createdAt).toLocaleDateString();
      if (d !== currentDate) {
        currentDate = d;
        groups.push({ type: "date", date: d });
      }
      groups.push(msg);
    }
    return groups;
  };

  const todayStr = new Date().toLocaleDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString();

  const formatDateLabel = (dateStr) => {
    if (dateStr === todayStr) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  };

  const grouped = groupByDate(messages);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-channel">
            <button className="chat-menu-btn" onClick={onMenuOpen} title="Open channels">
              <Menu size={18} />
            </button>
            <h2>{channelLabel}</h2>
          </div>
          <div className="chat-header-meta">
            <span className="chat-online-dot" />
            <span>Connected</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {channelDesc}
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-icon-btn" title="Voice call">
            <Phone size={16} />
          </button>
          <button className="chat-icon-btn" title="Search in channel">
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="chat-messages-area">
        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {grouped.map((item, idx) => {
              if (item.type === "date") {
                return (
                  <div key={`date-${idx}`} className="chat-date-divider">
                    <div className="chat-date-line" />
                    <span>{formatDateLabel(item.date)}</span>
                    <div className="chat-date-line" />
                  </div>
                );
              }
              return (
                <MessageBubble key={item._id || item.id} message={item} currentUser={user} />
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer onSend={handleSend} sending={sending} />
    </div>
  );
};

export default ChatWindow;
