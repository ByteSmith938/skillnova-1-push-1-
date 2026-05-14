import React from 'react';
import { Search, Filter, Plus, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentHeader = () => {
  return (
    <header className="ws-header">
      <div className="ws-header-left">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Student Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Manage learners, attendance, registrations and workshop participation
        </motion.p>
      </div>

      <div className="ws-header-center">
        <div className="ws-search-box">
          <Search size={18} className="ws-search-icon" />
          <input type="text" placeholder="Search students..." className="ws-search-input" />
        </div>
      </div>

      <div className="ws-header-right">
        <button className="ws-icon-btn" title="Filter">
          <Filter size={18} />
        </button>
        <button className="ws-sort-btn">
          <span>Sort By</span>
          <ChevronDown size={14} />
        </button>
        <motion.button
          className="btn btn-primary ws-create-btn"
          whileHover={{ scale: 1.05, translateY: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} /> Add Student
        </motion.button>
      </div>
    </header>
  );
};

export default StudentHeader;
