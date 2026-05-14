import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import OnlineMembers from '../components/chat/OnlineMembers';
import ActivityPanel from '../components/chat/ActivityPanel';
import AppBackground from '../components/AppBackground';
import '../styles/TeamChat.css';

const TeamChat = () => {
  const [activeChannel, setActiveChannel] = useState('general');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="dashboard-container teamchat-container">
      <AppBackground />
      <Sidebar activeTab="Team Chat" />

      <main className="teamchat-body">
        <div className="teamchat-inner">
          <ChatSidebar 
            activeChannel={activeChannel} 
            onChannelChange={setActiveChannel}
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
          />
          
          <ChatWindow 
            activeChannel={activeChannel} 
            onMenuOpen={() => setIsMobileNavOpen(true)}
          />

          <aside className="team-panel">
            <OnlineMembers />
            <ActivityPanel />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TeamChat;
