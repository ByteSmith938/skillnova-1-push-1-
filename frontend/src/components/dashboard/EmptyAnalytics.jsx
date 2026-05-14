import React from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';

const EmptyAnalytics = () => {
  return (
    <motion.div 
      className="analytics-empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="analytics-empty-icon">
        <LineChart size={48} strokeWidth={1.5} />
      </div>
      <h3>No analytics data available yet</h3>
      <p>Analytics will appear after workshops and students start using the platform</p>
    </motion.div>
  );
};

export default EmptyAnalytics;
