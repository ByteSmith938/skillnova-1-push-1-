import { useState } from "react";
import { Hash, BookOpen, Users, Megaphone, Search, Plus, MessageSquare } from "lucide-react";

const ICON_MAP = {
  Hash, BookOpen, Users, Megaphone
};

const defaultIcon = Hash;

const ChatSidebar = ({ channels = [], activeChannel, onChannelChange, isOpen, onClose }) => {
  const [search, setSearch] = useState("");

  const filtered = channels.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div className="chat-mobile-overlay" onClick={onClose} />
      )}

      <aside className={`chat-sidebar ${isOpen ? "mobile-open" : ""}`}>
        <div className="chat-sidebar-header">
          <p className="chat-sidebar-title">Team Communication</p>
          <div className="chat-search-box">
            <Search size={14} />
            <input
              className="chat-search-input"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-channels-list">
          <div className="channels-group-label">Channels</div>
          {filtered.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 13, padding: "20px 10px", textAlign: "center" }}>
              No channels found
            </div>
          ) : (
            filtered.map(ch => {
              const Icon = ICON_MAP[ch.icon] || defaultIcon;
              return (
                <div
                  key={ch.name}
                  className={`channel-item ${activeChannel === ch.name ? "active" : ""}`}
                  onClick={() => { onChannelChange(ch.name); onClose(); }}
                >
                  <div className="channel-icon">
                    <Icon size={14} />
                  </div>
                  <span className="channel-name">{ch.label}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="chat-sidebar-footer">
          <button className="chat-quick-btn">
            <Plus size={14} />
            New Channel
          </button>
          <button className="chat-quick-btn">
            <MessageSquare size={14} />
            New Message
          </button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
