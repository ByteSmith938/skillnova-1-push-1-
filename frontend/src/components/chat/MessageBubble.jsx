import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

/* Renders a single message bubble (own, other, or system) */
const MessageBubble = ({ message }) => {
  if (message.type === 'system') {
    return (
      <div className="system-message">
        <span className="system-dot" />
        {message.text}
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#6b7280' }}>
          {message.time}
        </span>
      </div>
    );
  }

  const isOwn = message.isOwn;

  return (
    <div className={`message-row ${isOwn ? 'own' : ''}`}>
      {/* Avatar */}
      <div
        className="msg-avatar"
        style={{ background: message.avatarColor }}
        title={message.sender}
      >
        {message.sender.charAt(0)}
      </div>

      {/* Body */}
      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-sender">{message.sender}</span>
          <span className="msg-time">{message.time}</span>
        </div>
        <div className="msg-bubble">
          {message.text}
        </div>
        {/* Status ticks for own messages */}
        {isOwn && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
            <CheckCheck size={13} style={{ color: 'var(--accent-blue, #00d2ff)' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
