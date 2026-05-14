import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const QuickInsights = ({ insights }) => {
  return (
    <div className="analytics-chart-panel insights-panel">
      <div className="analytics-chart-header">
        <div>
          <h3>Quick Insights</h3>
          <p>AI-generated platform analytics</p>
        </div>
        <Zap className="insights-icon" size={20} color="#FF00AA" />
      </div>
      <div className="insights-list">
        {insights && insights.length > 0 ? (
          insights.map((insight, index) => (
            <motion.div 
              key={index}
              className="insight-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="insight-dot"></div>
              <p>{insight}</p>
            </motion.div>
          ))
        ) : (
          <div className="analytics-empty-chart">Generating insights...</div>
        )}
      </div>
    </div>
  );
};

export default QuickInsights;
