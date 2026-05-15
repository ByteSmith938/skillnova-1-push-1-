import { BookOpen, UserCheck, Server, BarChart2, Bug, Megaphone, CheckCircle, Calendar } from "lucide-react";

const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
};

const ACTIVITY_ICONS = [
  BookOpen, UserCheck, Server, BarChart2, Bug, Megaphone
];

const QUICK_ACTIONS = [
  { icon: Bug,          label: "Report Bug",          color: "#ef4444" },
  { icon: Megaphone,    label: "Send Announcement",   color: "#00d2ff" },
  { icon: CheckCircle,  label: "Create Task",         color: "#10b981" },
  { icon: Calendar,     label: "Schedule Maintenance", color: "#f59e0b" },
];

const ActivityPanel = ({ activities = [] }) => (
  <>
    <div className="team-panel-section">
      <p className="panel-section-title">Recent Internal Activity</p>
      <div className="activity-feed">
        {activities.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
            No recent activity
          </div>
        ) : (
          activities.map((item, idx) => {
            const Icon = ACTIVITY_ICONS[idx % ACTIVITY_ICONS.length];
            return (
              <div key={item.id} className="activity-feed-item">
                <div className="activity-dot" style={{ borderColor: `${item.color}30`, background: `${item.color}12` }}>
                  <Icon size={12} style={{ color: item.color }} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">{item.text}</p>
                  <span className="activity-time">{timeAgo(item.time)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>

    <div className="team-panel-section">
      <p className="panel-section-title">Quick Actions</p>
      <div className="quick-action-grid">
        {QUICK_ACTIONS.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button key={idx} className="quick-action-btn">
              <Icon size={18} style={{ color: action.color }} />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  </>
);

export default ActivityPanel;
