import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Library, Users, Settings,
  LogOut, Activity, MessageSquare,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { UserAvatar } from '../profile/ProfileDropdown';

const Sidebar = ({ activeTab = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const displayName = profile?.fullName || user?.username || 'Admin';
  const role        = profile?.role     || user?.role     || 'admin';
  const avatarUrl   = profile?.avatarUrl || '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h2 className="sidebar-logo" onClick={() => navigate('/')}>SkillNova</h2>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'Workshops' ? 'active' : ''}`}
          onClick={() => navigate('/workshops')}
        >
          <Library size={20} />
          <span>Workshops</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'Students' ? 'active' : ''}`}
          onClick={() => navigate('/students')}
        >
          <Users size={20} />
          <span>Students</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'Analytics' ? 'active' : ''}`}
          onClick={() => navigate('/analytics')}
        >
          <Activity size={20} />
          <span>Analytics</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'Team Chat' ? 'active' : ''}`}
          onClick={() => navigate('/team-chat')}
        >
          <MessageSquare size={20} />
          <span>Team Chat</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        {/* Mini profile card */}
        <div className="sidebar-user-card" onClick={() => navigate('/settings?tab=profile')}>
          <UserAvatar avatarUrl={avatarUrl} name={displayName} size={34} />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{displayName}</span>
            <span className="sidebar-user-role">{role}</span>
          </div>
        </div>

        <div
          className="nav-item logout-item"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
