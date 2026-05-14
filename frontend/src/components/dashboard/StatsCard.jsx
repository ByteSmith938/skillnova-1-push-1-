import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ label, value, icon, trendText, delay = 0, isCircular = false, percentage = 0 }) => {
  return (
    <motion.div 
      className="stats-card-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="stats-card-header">
        <span className="stats-card-label">{label}</span>
        <div className="stats-card-icon">{icon}</div>
      </div>
      <div className="stats-card-body">
        {isCircular ? (
          <div className="stats-circular-progress">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{percentage}%</text>
            </svg>
          </div>
        ) : (
          <span className="stats-card-value">{value}</span>
        )}
      </div>
      {trendText && (
        <div className="stats-card-footer">
          <span className="stats-card-trend">{trendText}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
