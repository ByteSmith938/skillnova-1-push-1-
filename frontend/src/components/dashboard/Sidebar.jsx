import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Library, PlusSquare, Users, Settings, LogOut, Activity, MessageSquare } from 'lucide-react';

const Sidebar = ({ activeTab = 'Dashboard' }) => {
  const navigate = useNavigate();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h2 className="sidebar-logo" onClick={() => navigate("/")}>SkillNova</h2>
      </div>

      <nav className="sidebar-nav">
        <div className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => navigate("/dashboard")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        <div className={`nav-item ${activeTab === 'Workshops' ? 'active' : ''}`} onClick={() => navigate("/workshops")}>
          <Library size={20} />
          <span>Workshops</span>
        </div>
        <div className={`nav-item ${activeTab === 'Students' ? 'active' : ''}`} onClick={() => navigate("/students")}>
          <Users size={20} />
          <span>Students</span>
        </div>
        <div className={`nav-item ${activeTab === 'Analytics' ? 'active' : ''}`} onClick={() => navigate("/analytics")}>
          <Activity size={20} />
          <span>Analytics</span>
        </div>
        <div className={`nav-item ${activeTab === 'Team Chat' ? 'active' : ''}`} onClick={() => navigate("/team-chat")}>
          <MessageSquare size={20} />
          <span>Team Chat</span>
        </div>
        <div className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => navigate("/settings")}>
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item logout-item">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
