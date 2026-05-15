import React, { useRef, useEffect } from 'react';
import { Smile, Paperclip, Send } from 'lucide-react';

const MessageComposer = ({ onSend, sending }) => {
  const [text, setTextState] = React.useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setTextState('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-composer">
      <div className="composer-box">
        <textarea
          ref={textareaRef}
          className="composer-input"
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          value={text}
          onChange={e => setTextState(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className="composer-actions">
          <button className="composer-icon-btn" title="Emoji">
            <Smile size={17} />
          </button>
          <button className="composer-icon-btn" title="Attach file">
            <Paperclip size={17} />
          </button>
          <button
            className="composer-send-btn"
            onClick={handleSend}
            title="Send message"
            style={sending ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
