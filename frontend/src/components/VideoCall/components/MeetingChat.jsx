// components/MeetingChat.jsx
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const MeetingChat = ({ messages = [], onSendMessage, currentUser }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="w-80 bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/90 backdrop-blur-xl border-l border-gray-200/30 dark:border-gray-700/30 flex flex-col">
      <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
          Meeting Chat
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-txt-secondary-light dark:text-txt-secondary-dark mx-auto mb-3 opacity-50" />
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-bg-primary-light/50 dark:bg-bg-primary-dark/50 rounded-lg p-3 border border-gray-200/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                    {msg.sender}
                  </span>
                  <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-sm text-txt-primary-light dark:text-txt-primary-dark">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200/30 dark:border-gray-700/30 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-secondary-light dark:placeholder-txt-secondary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
          />
          <button 
            type="submit"
            className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingChat;
