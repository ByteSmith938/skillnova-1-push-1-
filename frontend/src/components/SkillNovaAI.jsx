import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Send, Paperclip } from 'lucide-react';
import './SkillNovaAI.css';

// Animated Robot Component
const AnimatedRobot = ({ state = 'idle' }) => {
  return (
    <div className={`robot-container state-${state}`}>
      {/* Particles */}
      <div className="particles-layer">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`particle p${i + 1}`}></div>
        ))}
      </div>
      
      {/* Rotating Ring */}
      <div className="robot-ring"></div>
      
      {/* Main Robot Body floating */}
      <div className="robot-body-wrapper">
        <svg 
          viewBox="0 0 100 100" 
          width="100%" 
          height="100%" 
          className="robot-svg"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#0055FF" />
            </linearGradient>
            <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a0a10" />
              <stop offset="100%" stopColor="#1a1a2e" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowSmall" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Holographic Aura */}
          <circle cx="50" cy="50" r="45" fill="rgba(0, 210, 255, 0.08)" className="holographic-aura" />
          
          {/* Antenna */}
          <line x1="50" y1="25" x2="50" y2="12" stroke="#00D2FF" strokeWidth="2" className="robot-antenna-line" />
          <circle cx="50" cy="10" r="3.5" fill="#FF00AA" filter="url(#neonGlowSmall)" className="robot-antenna-bulb" />

          {/* Main Body */}
          <rect x="20" y="25" width="60" height="50" rx="20" fill="url(#bodyGrad)" filter="url(#neonGlow)" className="robot-body" />
          
          {/* Ear modules */}
          <rect x="15" y="40" width="10" height="20" rx="4" fill="#00D2FF" className="robot-ear left" />
          <rect x="75" y="40" width="10" height="20" rx="4" fill="#00D2FF" className="robot-ear right" />

          {/* Face Panel */}
          <rect x="30" y="35" width="40" height="26" rx="8" fill="url(#faceGrad)" className="robot-face" />

          {/* Eyes */}
          <g className="robot-eyes">
            <circle cx="40" cy="48" r="3.5" fill="#00D2FF" filter="url(#neonGlowSmall)" className="robot-eye left" />
            <circle cx="60" cy="48" r="3.5" fill="#00D2FF" filter="url(#neonGlowSmall)" className="robot-eye right" />
          </g>

        </svg>
      </div>
    </div>
  );
};

const SkillNovaAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="skillnova-ai-wrapper">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="ai-mascot-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            title="Ask SkillNova AI"
          >
            <AnimatedRobot state="idle" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="ai-panel-header">
              <div className="ai-header-left">
                <div className="ai-header-avatar">
                  <div style={{ width: 36, height: 36 }}>
                    <AnimatedRobot state="idle" />
                  </div>
                </div>
                <div className="ai-header-title">
                  <h3>SkillNova AI</h3>
                  <span>Your intelligent learning assistant</span>
                </div>
              </div>
              <div className="ai-header-right">
                <button className="ai-icon-btn" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                  <Minus size={18} />
                </button>
                <button className="ai-icon-btn" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="ai-chat-area">
              <div className="ai-message ai-message-system">
                <div className="ai-message-avatar">
                  <div style={{ width: 28, height: 28 }}>
                    <AnimatedRobot state="idle" />
                  </div>
                </div>
                <div className="ai-message-bubble">
                  Hi 👋 I'm SkillNova AI. Ask me any doubt.
                </div>
              </div>
            </div>

            <div className="ai-input-area">
              <div className="ai-input-container">
                <button className="ai-attach-btn" disabled>
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="ai-text-input"
                />
                <button className="ai-send-btn" disabled={!inputValue.trim()}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillNovaAI;
