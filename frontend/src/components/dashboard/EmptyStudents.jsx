import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';

const EmptyStudents = () => {
  return (
    <motion.div 
      className="st-empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="st-empty-icon">
        <Users size={48} strokeWidth={1.5} />
      </div>
      <h3>No students found</h3>
      <p>Students will appear here after workshop registration</p>
      <button className="btn btn-primary st-create-btn">
        <Plus size={20} /> Add Student
      </button>
    </motion.div>
  );
};

export default EmptyStudents;
