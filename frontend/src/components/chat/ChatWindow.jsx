import React, { useRef, useEffect } from 'react';
import { Phone, Search, Menu } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';

/* ---- Mock messages per channel ---- */
const MOCK_MESSAGES = {
  general: [
    { id: 1,  type: 'system',  text: 'Alex Kumar pinned a message.',                                        time: '9:00 AM' },
    { id: 2,  isOwn: false,    sender: 'Alex Kumar',   avatarColor: 'linear-gradient(135deg,#00d2ff,#7000ff)', text: 'Good morning team! Quick reminder — AI assistant rollout is scheduled for tomorrow 10 AM IST. Please make sure the staging env is green.',              time: '9:02 AM' },
    { id: 3,  isOwn: false,    sender: 'Priya Sharma', avatarColor: 'linear-gradient(135deg,#f59e0b,#ef4444)', text: 'Confirmed! I\'ve already done a smoke test on staging. Everything looks solid. 🟢',                                                                 time: '9:05 AM' },
    { id: 4,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Perfect. I\'ll send the announcement to all students 30 minutes before the rollout.',                                                            time: '9:07 AM' },
    { id: 5,  type: 'system',  text: 'Sara Nair joined the channel.',                                       time: '9:10 AM' },
    { id: 6,  isOwn: false,    sender: 'Sara Nair',    avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Hey all! Just checked the deployment pipeline — v2.4.1 is ready. Shall I trigger the production deploy after the morning standup?',               time: '9:12 AM' },
    { id: 7,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Yes, go ahead Sara. Let\'s do it at 11 AM after the standup wraps.',                                                                          time: '9:14 AM' },
    { id: 8,  isOwn: false,    sender: 'James Chen',   avatarColor: 'linear-gradient(135deg,#f97316,#eab308)', text: 'I\'ve finished the new Settings page designs. Pushing the Figma link in #feature-requests now.',                                                time: '9:20 AM' },
  ],
  bugs: [
    { id: 1,  type: 'system',  text: 'This channel is for bug reports and tracking.',                       time: 'Yesterday' },
    { id: 2,  isOwn: false,    sender: 'Rajan Mehta',  avatarColor: 'linear-gradient(135deg,#10b981,#0891b2)', text: '🐛 Bug #47: QR code generation fails when workshop title contains special characters (&, %). Reproduced 3 times on Chrome & Firefox.',             time: '10:30 AM' },
    { id: 3,  isOwn: false,    sender: 'Sara Nair',    avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Got it. Root cause traced to unescaped URI encoding in the QR utility. Fix is straightforward — will patch this in tonight\'s build.',         time: '10:45 AM' },
    { id: 4,  type: 'system',  text: 'Sara Nair marked Bug #47 as In Progress.',                            time: '10:46 AM' },
    { id: 5,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Also logging Bug #48: Student profile images not loading on mobile Safari. Seems like a CORS issue on the CDN config.',                         time: '11:00 AM' },
    { id: 6,  isOwn: false,    sender: 'Rajan Mehta',  avatarColor: 'linear-gradient(135deg,#10b981,#0891b2)', text: 'I\'ll look into the CORS headers on the S3 bucket. Will update by EOD.',                                                                    time: '11:05 AM' },
    { id: 7,  type: 'system',  text: 'Bug #47 patched and merged to main.',                                 time: '3:00 PM' },
  ],
  workshops: [
    { id: 1,  isOwn: false,    sender: 'Priya Sharma', avatarColor: 'linear-gradient(135deg,#f59e0b,#ef4444)', text: 'Workshop "Node.js Advanced" has 3 students with incomplete attendance. Should I manually override or send them a reminder first?',              time: '8:30 AM' },
    { id: 2,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Send reminders first. Give them 24 hours to respond. If no action, override and flag the profiles.',                                           time: '8:35 AM' },
    { id: 3,  isOwn: false,    sender: 'Priya Sharma', avatarColor: 'linear-gradient(135deg,#f59e0b,#ef4444)', text: 'Done! Reminders sent to all 3. Also — the "React Fundamentals" workshop got 47 new registrations overnight! 🎉',                              time: '8:40 AM' },
    { id: 4,  type: 'system',  text: 'Workshop registration crossed 100 students milestone.',                time: '9:00 AM' },
    { id: 5,  isOwn: false,    sender: 'Alex Kumar',   avatarColor: 'linear-gradient(135deg,#00d2ff,#7000ff)', text: 'Fantastic numbers! Let\'s make sure the QR check-in is ready for the session tomorrow. Priya, can you run a dry run at 4 PM today?',           time: '9:10 AM' },
    { id: 6,  isOwn: false,    sender: 'Priya Sharma', avatarColor: 'linear-gradient(135deg,#f59e0b,#ef4444)', text: 'Absolutely, I\'ll set it up. 👍',                                                                                                           time: '9:12 AM' },
  ],
  students: [
    { id: 1,  isOwn: false,    sender: 'Rajan Mehta',  avatarColor: 'linear-gradient(135deg,#10b981,#0891b2)', text: 'Student Aryan Verma (ID: STU-2024-489) is reporting that he can\'t access his certificate for "Python Basics". The download link returns a 404.', time: '11:00 AM' },
    { id: 2,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Checking the certificate generator... The PDF was generated but the filename has a mismatch. Fixing the path mapping now.',                     time: '11:10 AM' },
    { id: 3,  type: 'system',  text: 'Certificate issue for STU-2024-489 resolved.',                        time: '11:20 AM' },
    { id: 4,  isOwn: false,    sender: 'Rajan Mehta',  avatarColor: 'linear-gradient(135deg,#10b981,#0891b2)', text: 'Student notified and confirmed receipt. Thanks for the quick fix! ✅',                                                                         time: '11:22 AM' },
    { id: 5,  isOwn: false,    sender: 'Alex Kumar',   avatarColor: 'linear-gradient(135deg,#00d2ff,#7000ff)', text: 'Great teamwork. Let\'s add a validation step to the cert generator so paths are checked at generation time — add it to Feature Requests.',      time: '11:30 AM' },
  ],
  deployment: [
    { id: 1,  type: 'system',  text: 'Automated deployment log — last 24 hours.',                           time: 'Today' },
    { id: 2,  isOwn: false,    sender: 'Sara Nair',    avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: '🚀 Deployment pipeline triggered for v2.4.1. Build time: ~4 min. Monitoring now...',                                                           time: '11:00 AM' },
    { id: 3,  type: 'system',  text: '✅ Build passed. All 214 tests green. Deploying to production.',      time: '11:04 AM' },
    { id: 4,  isOwn: false,    sender: 'Sara Nair',    avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Production deploy complete. API health check: OK. DB connections: 12/50 active. CDN cache purged.',                                            time: '11:08 AM' },
    { id: 5,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Running smoke tests on live... Dashboard, Workshops, Students — all loading correctly. Settings page transitions smooth. 🟢',                  time: '11:15 AM' },
    { id: 6,  type: 'system',  text: 'v2.4.1 deployment verified and marked stable.',                       time: '11:16 AM' },
  ],
  features: [
    { id: 1,  isOwn: false,    sender: 'James Chen',   avatarColor: 'linear-gradient(135deg,#f97316,#eab308)', text: 'Feature request: Add dark/light theme toggle accessible from the admin header. Figma mockup: [settings-theme-toggle.fig]',                     time: '9:25 AM' },
    { id: 2,  isOwn: false,    sender: 'Alex Kumar',   avatarColor: 'linear-gradient(135deg,#00d2ff,#7000ff)', text: 'Love this. Let\'s also add a compact mode for the sidebar — some admins are using smaller monitors.',                                         time: '9:30 AM' },
    { id: 3,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: 'Adding both to the v2.5 milestone on the roadmap. Priya, can you estimate the student-facing certificate template builder we discussed?',      time: '9:40 AM' },
    { id: 4,  isOwn: false,    sender: 'Priya Sharma', avatarColor: 'linear-gradient(135deg,#f59e0b,#ef4444)', text: 'Estimated 2 sprints. I\'ll break it into: template editor UI, PDF renderer, and preview system. Will create sub-tasks today.',               time: '9:50 AM' },
  ],
  announcements: [
    { id: 1,  type: 'system',  text: 'Only admins can post in this channel.',                               time: 'Pinned' },
    { id: 2,  isOwn: false,    sender: 'Alex Kumar',   avatarColor: 'linear-gradient(135deg,#00d2ff,#7000ff)', text: '📢 ANNOUNCEMENT — Platform maintenance window scheduled: Sunday 2 AM – 4 AM IST. All services will be temporarily unavailable. Please inform students via the notification system.',  time: '8:00 AM' },
    { id: 3,  type: 'system',  text: 'All team members have been notified.',                                time: '8:01 AM' },
    { id: 4,  isOwn: true,     sender: 'You',          avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)', text: '📢 REMINDER — AI Assistant (SkillNova AI) rolls out to all admin accounts tomorrow at 10 AM IST. Beta testers please finalize your feedback forms by tonight.', time: '9:00 AM' },
  ],
};

const CHANNEL_META = {
  general:      { label: '# General Updates',    desc: 'Platform-wide updates and team communication' },
  bugs:         { label: '# Bug Reports',         desc: 'Report and track platform bugs and issues' },
  workshops:    { label: '# Workshop Issues',     desc: 'Manage workshop-related problems and escalations' },
  students:     { label: '# Student Support',     desc: 'Student issues, complaints and escalations' },
  deployment:   { label: '# Deployment Logs',     desc: 'CI/CD pipeline status and deployment updates' },
  features:     { label: '# Feature Requests',    desc: 'Propose and discuss new platform features' },
  announcements:{ label: '# Announcements',       desc: 'Official announcements from the admin team' },
};

const ChatWindow = ({ activeChannel, onMenuOpen }) => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = React.useState(MOCK_MESSAGES[activeChannel] || []);
  const prevChannelRef = useRef(activeChannel);

  // Reload messages when channel changes
  useEffect(() => {
    if (prevChannelRef.current !== activeChannel) {
      setMessages(MOCK_MESSAGES[activeChannel] || []);
      prevChannelRef.current = activeChannel;
    }
  }, [activeChannel]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now(),
      isOwn: true,
      sender: 'You',
      avatarColor: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
      text,
      time,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const meta = CHANNEL_META[activeChannel] || {};
  const onlineCount = 3;

  // Group messages by date (simplified — all under "Today")
  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-channel">
            <button className="chat-menu-btn" onClick={onMenuOpen} title="Open channels">
              <Menu size={18} />
            </button>
            <h2>{meta.label}</h2>
          </div>
          <div className="chat-header-meta">
            <span className="chat-online-dot" />
            <span>{onlineCount} online</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {meta.desc}
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-icon-btn" title="Voice call">
            <Phone size={16} />
          </button>
          <button className="chat-icon-btn" title="Search in channel">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages-area">
        <div className="chat-date-divider">
          <div className="chat-date-line" />
          <span>Today</span>
          <div className="chat-date-line" />
        </div>

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <MessageComposer onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
