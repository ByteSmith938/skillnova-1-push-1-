import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Activity, Calendar, Archive } from 'lucide-react';

const WorkshopStats = ({ total, live, upcoming, completed }) => {
  const stats = [
    { 
      label: 'Total Workshops', 
      value: total, 
      icon: <BookOpen size={24} style={{color: '#00D2FF'}} />, 
      badge: '+3 this week',
      badgeColor: '#10b981'
    },
    { 
      label: 'Live Workshops', 
      value: live, 
      icon: <Activity size={24} style={{color: '#FF00AA'}} />, 
      isLive: true
    },
    { 
      label: 'Upcoming Workshops', 
      value: upcoming, 
      icon: <Calendar size={24} style={{color: '#00D2FF'}} />, 
      badge: 'Scheduled',
      badgeColor: '#00D2FF'
    },
    { 
      label: 'Completed Workshops', 
      value: completed, 
      icon: <Archive size={24} style={{color: '#7000FF'}} />, 
      badge: 'Archived',
      badgeColor: '#7000FF'
    }
  ];

  return (
    <div className="ws-stats-grid">
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          className="ws-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, borderColor: 'rgba(0, 210, 255, 0.3)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 210, 255, 0.1)' }}
        >
          <div className="ws-stat-header">
            <span className="ws-stat-label">{stat.label}</span>
            <div className="ws-stat-icon">{stat.icon}</div>
          </div>
          <div className="ws-stat-body">
            <span className="ws-stat-value">{stat.value}</span>
          </div>
          <div className="ws-stat-footer">
            {stat.isLive ? (
              <div className="ws-stat-live-badge">
                <span className="ws-pulse-dot"></span>
                Ongoing right now
              </div>
            ) : (
              <span className="ws-stat-badge" style={{ color: stat.badgeColor, backgroundColor: `${stat.badgeColor}15` }}>
                {stat.badge}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkshopStats;
