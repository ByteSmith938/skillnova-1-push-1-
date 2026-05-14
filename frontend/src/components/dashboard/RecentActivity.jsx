import React from 'react';
import { motion } from 'framer-motion';
import { PlusSquare, Users, Download, Edit } from 'lucide-react';

const activities = [
  { id: 1, icon: <PlusSquare size={16} />, text: 'Workshop "React Bootcamp" created', time: '2 mins ago', color: '#00D2FF' },
  { id: 2, icon: <Users size={16} />, text: '15 students joined "AI Workshop"', time: '10 mins ago', color: '#7000FF' },
  { id: 3, icon: <Download size={16} />, text: 'QR attendance exported', time: '1 hour ago', color: '#FF00AA' },
  { id: 4, icon: <Edit size={16} />, text: 'Workshop "Advanced Node.js" updated', time: 'Today', color: '#00D2FF' },
];

const RecentActivity = () => {
  return (
    <div className="analytics-card activity-card">
      <h3 className="analytics-title">Recent Activity</h3>
      <div className="activity-list">
        {activities.map((act, index) => (
          <motion.div 
            key={act.id} 
            className="activity-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="activity-icon-wrap" style={{ color: act.color, backgroundColor: `${act.color}20`, border: `1px solid ${act.color}40` }}>
              {act.icon}
            </div>
            <div className="activity-content">
              <p className="activity-text">{act.text}</p>
              <span className="activity-time">{act.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
