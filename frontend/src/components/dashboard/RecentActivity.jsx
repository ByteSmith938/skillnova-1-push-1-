import React from 'react';
import { motion } from 'framer-motion';
import { PlusSquare, Users, CheckCircle, XCircle } from 'lucide-react';

const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
};

const typeIconMap = {
  workshop_created: <PlusSquare size={16} />,
  student_registered: <Users size={16} />,
  payment_approved: <CheckCircle size={16} />,
  payment_rejected: <XCircle size={16} />,
};

const getIcon = (act) => {
  return typeIconMap[act.type] || <Users size={16} />;
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="analytics-card activity-card">
      <h3 className="analytics-title">Recent Activity</h3>
      <div className="activity-list">
        {activities.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            No recent activity
          </div>
        ) : (
          activities.map((act, index) => (
            <motion.div 
              key={act.id} 
              className="activity-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="activity-icon-wrap" style={{ color: act.color, backgroundColor: `${act.color}20`, border: `1px solid ${act.color}40` }}>
                {getIcon(act)}
              </div>
              <div className="activity-content">
                <p className="activity-text">{act.text}</p>
                <span className="activity-time">{timeAgo(act.time)}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
