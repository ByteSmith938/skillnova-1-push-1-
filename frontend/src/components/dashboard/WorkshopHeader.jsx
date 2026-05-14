import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleGuard from '../auth/RoleGuard';

const WorkshopHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="ws-header">
      <div className="ws-header-left">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Workshops Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create, manage, monitor and organize all workshops
        </motion.p>
      </div>

      <div className="ws-header-center">
        <div className="ws-search-box">
          <Search size={18} className="ws-search-icon" />
          <input type="text" placeholder="Search workshops..." className="ws-search-input" />
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
        <RoleGuard allowedRoles={['admin']}>
          <motion.button
            className="btn btn-primary ws-create-btn"
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/create-workshop")}
          >
            <Plus size={20} /> Create Workshop
          </motion.button>
        </RoleGuard>
      </div>
    </header>
  );
};

export default WorkshopHeader;
