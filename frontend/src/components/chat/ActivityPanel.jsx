import React from 'react';
import { BookOpen, UserCheck, Server, BarChart2, Bug, Megaphone, CheckCircle, Calendar } from 'lucide-react';

const ACTIVITY = [
  { icon: BookOpen,   color: '#00d2ff', text: 'Workshop "React Fundamentals" created',  time: '2 mins ago'   },
  { icon: UserCheck,  color: '#10b981', text: 'Student issue #247 resolved',             time: '15 mins ago'  },
  { icon: Server,     color: '#7000ff', text: 'Production deployment completed v2.4.1',  time: '1 hr ago'     },
  { icon: BarChart2,  color: '#f59e0b', text: 'Analytics dashboard updated',             time: '2 hrs ago'    },
  { icon: Bug,        color: '#ef4444', text: 'QR bug report escalated to tech lead',    time: '3 hrs ago'    },
  { icon: Megaphone,  color: '#ec4899', text: 'Announcement sent to all students',       time: 'Yesterday'    },
];

const QUICK_ACTIONS = [
  { icon: Bug,          label: 'Report Bug',          color: '#ef4444' },
  { icon: Megaphone,    label: 'Send Announcement',   color: '#00d2ff' },
  { icon: CheckCircle,  label: 'Create Task',         color: '#10b981' },
  { icon: Calendar,     label: 'Schedule Maintenance', color: '#f59e0b' },
];

const ActivityPanel = () => (
  <>
    {/* Recent Activity */}
    <div className="team-panel-section">
      <p className="panel-section-title">Recent Internal Activity</p>
      <div className="activity-feed">
        {ACTIVITY.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="activity-feed-item">
              <div className="activity-dot" style={{ borderColor: `${item.color}30`, background: `${item.color}12` }}>
                <Icon size={12} style={{ color: item.color }} />
              </div>
              <div className="activity-content">
                <p className="activity-text">{item.text}</p>
                <span className="activity-time">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Quick Actions */}
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
