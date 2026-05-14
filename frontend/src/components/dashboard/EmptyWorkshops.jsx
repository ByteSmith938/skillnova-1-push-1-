import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Plus } from 'lucide-react';
import RoleGuard from '../auth/RoleGuard';

const EmptyWorkshops = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="ws-empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="ws-empty-icon">
        <Layers size={48} strokeWidth={1.5} />
      </div>
      <h3>No workshops created yet</h3>
      <p>Create your first workshop to begin</p>
      <RoleGuard allowedRoles={['admin']}>
        <button 
          className="btn btn-primary ws-create-btn"
          onClick={() => navigate("/create-workshop")}
        >
          <Plus size={20} /> Create Workshop
        </button>
      </RoleGuard>
    </motion.div>
  );
};

export default EmptyWorkshops;
