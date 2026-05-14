import React from 'react';

const MEMBERS = [
  { id: 1, name: 'Alex Kumar',       role: 'Super Admin',        status: 'online', avatarColor: 'linear-gradient(135deg,#00d2ff,#7000ff)', initials: 'AK' },
  { id: 2, name: 'Priya Sharma',     role: 'Workshop Manager',   status: 'online', avatarColor: 'linear-gradient(135deg,#f59e0b,#ef4444)', initials: 'PS' },
  { id: 3, name: 'Rajan Mehta',      role: 'Support Staff',      status: 'busy',   avatarColor: 'linear-gradient(135deg,#10b981,#0891b2)', initials: 'RM' },
  { id: 4, name: 'Sara Nair',        role: 'Technical Lead',     status: 'online', avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', initials: 'SN' },
  { id: 5, name: 'James Chen',       role: 'UI/UX Designer',     status: 'away',   avatarColor: 'linear-gradient(135deg,#f97316,#eab308)', initials: 'JC' },
];

const statusLabel = { online: 'Online', busy: 'Busy', away: 'Away' };

const OnlineMembers = () => (
  <div className="team-panel-section">
    <p className="panel-section-title">Online Team Members</p>
    {MEMBERS.map(m => (
      <div key={m.id} className="member-item">
        <div className="member-avatar">
          <div
            className="member-avatar-circle"
            style={{ background: m.avatarColor }}
            title={m.name}
          >
            {m.initials}
          </div>
          <span className={`member-status-dot ${m.status}`} title={statusLabel[m.status]} />
        </div>
        <div className="member-info">
          <div className="member-name">{m.name}</div>
          <div className="member-role">{m.role}</div>
        </div>
      </div>
    ))}
  </div>
);

export { MEMBERS };
export default OnlineMembers;
