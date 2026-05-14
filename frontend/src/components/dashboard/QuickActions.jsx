import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusSquare, UserPlus, QrCode, Megaphone } from 'lucide-react';
import RoleGuard from '../auth/RoleGuard';

const actions = [
  { id: 1, icon: <PlusSquare size={20} />, label: 'New Workshop', route: '/create-workshop', color: '#00D2FF' },
  { id: 2, icon: <UserPlus size={20} />, label: 'Add Student', route: '#', color: '#7000FF' },
  { id: 3, icon: <QrCode size={20} />, label: 'Generate QR', route: '#', color: '#FF00AA' },
  { id: 4, icon: <Megaphone size={20} />, label: 'Send Announcement', route: '#', color: '#00D2FF' },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions-row">
      {actions.map((action, i) => {
        const tile = (
          <motion.button
            key={action.id}
            className="quick-action-tile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (action.route !== '#') navigate(action.route);
            }}
            style={{ '--tile-color': action.color }}
          >
            <div className="tile-icon">{action.icon}</div>
            <span className="tile-label">{action.label}</span>
          </motion.button>
        );

        if (action.label === 'New Workshop') {
          return (
            <RoleGuard allowedRoles={['admin']} key={action.id}>
              {tile}
            </RoleGuard>
          );
        }

        return <React.Fragment key={action.id}>{tile}</React.Fragment>;
      })}
    </div>
  );
};

export default QuickActions;
