const statusLabel = { online: "Online", busy: "Busy", away: "Away" };

const OnlineMembers = ({ users = [] }) => {
  const sorted = [...users].sort((a, b) => (a.status === "online" ? -1 : 1));

  return (
    <div className="team-panel-section">
      <p className="panel-section-title">Online Team Members</p>
      {sorted.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "10px 0" }}>
          No members online
        </div>
      ) : (
        sorted.map(m => (
          <div key={m.username} className="member-item">
            <div className="member-avatar">
              <div
                className="member-avatar-circle"
                style={{ background: m.avatarColor }}
                title={m.username}
              >
                {m.initials}
              </div>
              <span className={`member-status-dot ${m.status}`} title={statusLabel[m.status]} />
            </div>
            <div className="member-info">
              <div className="member-name">{m.username}</div>
              <div className="member-role">{m.role}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OnlineMembers;
