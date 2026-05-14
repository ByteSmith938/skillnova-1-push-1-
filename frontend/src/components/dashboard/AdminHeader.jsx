import React from 'react';
import { Search, Filter, Plus, ChevronDown, Download, RefreshCw, Save, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleGuard from '../auth/RoleGuard';

const AdminHeader = ({ 
  title, 
  subtitle, 
  searchPlaceholder = "Search...", 
  btnText = "Add", 
  onBtnClick,
  showAnalyticsActions = false,
  showSettingsActions = false
}) => {
  return (
    <header className="ws-header">
      <div className="ws-header-left">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="ws-header-center">
        <div className="ws-search-box">
          <Search size={18} className="ws-search-icon" />
          <input type="text" placeholder={searchPlaceholder} className="ws-search-input" />
        </div>
      </div>

      <div className="ws-header-right">
        {showSettingsActions ? (
          <RoleGuard allowedRoles={['admin']}>
            <motion.button
              className="ws-sort-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw size={16} /> <span>Reset Defaults</span>
            </motion.button>
            <motion.button
              className="btn btn-primary ws-create-btn"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={20} /> Save Changes
            </motion.button>
          </RoleGuard>
        ) : showAnalyticsActions ? (
          <>
            <button className="ws-sort-btn">
              <span>Last 30 Days</span>
              <ChevronDown size={14} />
            </button>
            <button className="ws-icon-btn" title="Refresh Analytics">
              <RefreshCw size={18} />
            </button>
            <motion.button
              className="btn btn-primary ws-create-btn"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} /> Export Report
            </motion.button>
          </>
        ) : (
          <>
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
              onClick={onBtnClick}
            >
              <Plus size={20} /> {btnText}
            </motion.button>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
