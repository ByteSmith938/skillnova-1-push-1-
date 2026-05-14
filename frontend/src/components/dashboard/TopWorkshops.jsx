import React from 'react';
import { motion } from 'framer-motion';

const fallbackImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop";

const TopWorkshops = ({ workshops }) => {
  return (
    <div className="analytics-chart-panel">
      <div className="analytics-chart-header">
        <div>
          <h3>Top Performing Workshops</h3>
          <p>Highest attendance and engagement</p>
        </div>
      </div>
      <div className="top-workshops-list">
        {workshops && workshops.length > 0 ? (
          workshops.map((ws, index) => (
            <motion.div 
              key={ws._id || index}
              className="top-ws-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="top-ws-rank">#{index + 1}</div>
              <img src={ws.workshopImage || fallbackImage} alt={ws.title} className="top-ws-img" />
              <div className="top-ws-info">
                <h4>{ws.title}</h4>
                <p>{ws.instructor}</p>
              </div>
              <div className="top-ws-stats">
                <div className="stat-pill attendance">{ws.attendance || 0}% Att.</div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="analytics-empty-chart">No top workshops data</div>
        )}
      </div>
    </div>
  );
};

export default TopWorkshops;
