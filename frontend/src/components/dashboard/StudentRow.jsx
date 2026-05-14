import React from 'react';
import { User, MessageSquare, Edit2, Trash2 } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const StudentRow = ({ student, workshopTitle, onDelete }) => {
  const attendance = Math.floor(Math.random() * 40) + 60; // Mock
  const progress = Math.floor(Math.random() * 50) + 50; // Mock

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return '#10b981';
      case 'IN WORKSHOP': return '#00D2FF';
      case 'COMPLETED': return '#7000FF';
      default: return '#94A3B8';
    }
  };

  const status = 'IN WORKSHOP';
  const statusColor = getStatusColor(status);

  return (
    <tr className="student-row">
      <td className="sr-avatar-cell">
        <div className="sr-avatar">
          {getInitials(student.name)}
        </div>
      </td>
      <td className="sr-name-cell">
        <div className="sr-name">{student.name}</div>
        <div className="sr-college">{student.college}</div>
      </td>
      <td className="sr-email-cell">{student.email}</td>
      <td className="sr-workshop-cell">
        <span className="sr-workshop-badge">{workshopTitle || 'None'}</span>
      </td>
      <td className="sr-progress-cell">
        <div className="sr-progress-wrapper">
          <div className="sr-progress-info">
            <span>{attendance}%</span>
          </div>
          <div className="sr-progress-bar">
            <div className="sr-progress-fill attendance" style={{ width: `${attendance}%` }}></div>
          </div>
        </div>
      </td>
      <td className="sr-progress-cell">
        <div className="sr-progress-wrapper">
          <div className="sr-progress-info">
            <span>{progress}%</span>
          </div>
          <div className="sr-progress-bar">
            <div className="sr-progress-fill course" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </td>
      <td className="sr-status-cell">
        <div className="sr-status-badge" style={{ color: statusColor, backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}40` }}>
          {status}
        </div>
      </td>
      <td className="sr-actions-cell">
        <div className="sr-actions-group">
          <button className="sr-action-btn view" title="View Profile">
            <User size={16} />
          </button>
          <button className="sr-action-btn edit" title="Edit">
            <Edit2 size={16} />
          </button>
          <button className="sr-action-btn msg" title="Message">
            <MessageSquare size={16} />
          </button>
          <button className="sr-action-btn delete" onClick={() => onDelete(student._id)} title="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;
