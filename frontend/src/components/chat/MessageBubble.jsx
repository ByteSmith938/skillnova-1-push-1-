import { CheckCheck } from "lucide-react";

const formatTime = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getInitials = (name) => name.charAt(0).toUpperCase();

const AVATAR_COLORS = {
  sagar: "linear-gradient(135deg,#00d2ff,#7000ff)",
  pranit: "linear-gradient(135deg,#8b5cf6,#ec4899)"
};

const MessageBubble = ({ message, currentUser }) => {
  if (message.type === "system") {
    return (
      <div className="system-message">
        <span className="system-dot" />
        {message.text}
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "#6b7280" }}>
          {formatTime(message.createdAt)}
        </span>
      </div>
    );
  }

  const isOwn = message.senderId === currentUser?.username;
  const avatarColor = AVATAR_COLORS[message.senderId] || "linear-gradient(135deg,#f59e0b,#ef4444)";

  return (
    <div className={`message-row ${isOwn ? "own" : ""}`}>
      <div
        className="msg-avatar"
        style={{ background: avatarColor }}
        title={message.senderName}
      >
        {getInitials(message.senderName)}
      </div>

      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-sender">{message.senderName}</span>
          <span className="msg-time">{formatTime(message.createdAt)}</span>
          <span className="msg-time" style={{ fontSize: "10px", textTransform: "uppercase" }}>
            {message.senderRole}
          </span>
        </div>
        <div className="msg-bubble">
          {message.message}
        </div>
        {isOwn && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
            <CheckCheck size={13} style={{ color: "var(--accent-blue, #00d2ff)" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
