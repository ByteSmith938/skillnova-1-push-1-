import React from 'react';
import { Hash, Bug, BookOpen, Users, Terminal, Lightbulb, Megaphone, Search, Plus, MessageSquare } from 'lucide-react';

const CHANNELS = [
  { id: 'general',     label: 'General Updates',   icon: Hash,       unread: 3  },
  { id: 'bugs',        label: 'Bug Reports',        icon: Bug,        unread: 7  },
  { id: 'workshops',   label: 'Workshop Issues',    icon: BookOpen,   unread: 0  },
  { id: 'students',    label: 'Student Support',    icon: Users,      unread: 2  },
  { id: 'deployment',  label: 'Deployment Logs',    icon: Terminal,   unread: 0  },
  { id: 'features',    label: 'Feature Requests',   icon: Lightbulb,  unread: 1  },
  { id: 'announcements', label: 'Announcements',    icon: Megaphone,  unread: 0  },
];

const ChatSidebar = ({ activeChannel, onChannelChange, isOpen, onClose }) => {
  const [search, setSearch] = React.useState('');

  const filtered = CHANNELS.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="chat-mobile-overlay" onClick={onClose} />
      )}

      <aside className={`chat-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
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

        {/* Channels */}
        <div className="chat-channels-list">
          <div className="channels-group-label">Channels</div>
          {filtered.map(ch => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.id}
                className={`channel-item ${activeChannel === ch.id ? 'active' : ''}`}
                onClick={() => { onChannelChange(ch.id); onClose(); }}
              >
                <div className="channel-icon">
                  <Icon size={14} />
                </div>
                <span className="channel-name">{ch.label}</span>
                {ch.unread > 0 && (
                  <span className="channel-badge">{ch.unread}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
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

export { CHANNELS };
export default ChatSidebar;
