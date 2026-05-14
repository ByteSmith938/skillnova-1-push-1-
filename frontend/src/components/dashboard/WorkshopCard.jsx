import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Users, Eye, Edit2, Trash2 } from 'lucide-react';
import RoleGuard from '../auth/RoleGuard';

const WorkshopCard = ({ workshop, index, fallbackImage, onNavigate, onDelete }) => {
  const isLive = index % 3 === 0;
  const isUpcoming = index % 3 === 1;
  const status = isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'COMPLETED';
  const statusColor = isLive ? '#FF00AA' : isUpcoming ? '#00D2FF' : '#7000FF';

  const attendance = isUpcoming ? 0 : Math.floor(Math.random() * 40) + 60;

  return (
    <motion.div
      className="ws-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, borderColor: 'rgba(0, 210, 255, 0.3)', boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 210, 255, 0.1)' }}
    >
      <div className="ws-card-thumb" onClick={() => onNavigate(`/dashboard/workshop/${workshop._id}`)}>
        <img
          src={workshop.workshopImage || fallbackImage}
          alt={workshop.title}
          className="ws-card-img"
        />
        <div className="ws-card-status" style={{ backgroundColor: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}50` }}>
          {isLive && <span className="ws-pulse-dot" style={{ backgroundColor: statusColor }}></span>}
          {status}
        </div>
      </div>
      
      <div className="ws-card-content" onClick={() => onNavigate(`/dashboard/workshop/${workshop._id}`)}>
        <span className="ws-card-category">TECHNICAL WORKSHOP</span>
        <h3 className="ws-card-title">{workshop.title}</h3>
        <p className="ws-card-desc">Advanced masterclass covering the core fundamentals and high-level architecture required for modern applications.</p>
        
        <div className="ws-card-info-grid">
          <div className="ws-info-item"><Calendar size={14}/> <span>{workshop.date}</span></div>
          <div className="ws-info-item"><Clock size={14}/> <span>{workshop.time}</span></div>
          <div className="ws-info-item"><MapPin size={14}/> <span>{workshop.location}</span></div>
          <div className="ws-info-item"><User size={14}/> <span>{workshop.instructor}</span></div>
          <div className="ws-info-item" style={{ gridColumn: 'span 2' }}><Users size={14} style={{ color: '#00D2FF' }}/> <span style={{ color: '#fff' }}>124 Enrolled</span></div>
        </div>

        <div className="ws-card-progress">
          <div className="ws-progress-header">
            <span>Attendance</span>
            <span>{attendance}%</span>
          </div>
          <div className="ws-progress-bar">
            <div className="ws-progress-fill" style={{ width: `${attendance}%` }}></div>
          </div>
        </div>
      </div>

      <div className="ws-card-actions">
        <button className="ws-action-btn view" onClick={() => onNavigate(`/dashboard/workshop/${workshop._id}`)}>
          <Eye size={16} /> View Details
        </button>
        <RoleGuard allowedRoles={['admin']}>
          <div className="ws-action-group">
            <button 
              className="ws-icon-btn edit" 
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`/workshops/edit/${workshop._id}`);
              }}
            >
              <Edit2 size={16} />
            </button>
            <button className="ws-icon-btn delete" onClick={(e) => onDelete(e, workshop._id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </RoleGuard>
      </div>
    </motion.div>
  );
};

export default WorkshopCard;
