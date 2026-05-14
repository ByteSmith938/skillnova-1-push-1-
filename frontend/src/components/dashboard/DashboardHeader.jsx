import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleGuard from '../auth/RoleGuard';

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header-new">
      <div className="dh-left">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Manage your technical workshops and learners.
        </motion.p>
      </div>

      <div className="dh-center">
        <div className="dh-search-box">
          <Search size={18} className="dh-search-icon" />
          <input type="text" placeholder="Search workshops..." className="dh-search-input" />
        </div>
      </div>

      <div className="dh-right">
        <button className="dh-icon-btn">
          <Bell size={20} />
          <span className="dh-badge">3</span>
        </button>
        
        <div className="dh-admin-profile">
          <div className="dh-admin-avatar">A</div>
          <span className="dh-admin-name">Admin</span>
          <ChevronDown size={14} />
        </div>

        <RoleGuard allowedRoles={['admin']}>
          <motion.button
            className="btn btn-primary dh-create-btn"
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

export default DashboardHeader;
