import React, { useState } from 'react';
import { ArrowLeft, Users, MessageSquare, Clipboard } from 'lucide-react';
import toast from 'react-hot-toast';

const CallHeader = ({ 
  meetingId, 
  isCallActive, 
  callDuration, 
  navigate, 
  showParticipants, 
  showChat, 
  onToggleParticipants, 
  onToggleChat, 
  participantsCount 
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast.success('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL:', err);
      });
  };

  return (
    <header className="h-16 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/90 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 flex items-center justify-between px-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex items-center gap-4">
        <div className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
          Meeting ID: {meetingId?.slice(0, 8)}...
        </div>
        {isCallActive && (
          <div className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm font-mono">
            {formatDuration(callDuration)}
          </div>
        )}

<button
          onClick={onCopyUrl}
          title="Copy URL"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-primary-600 hover:text-white transition-colors"
        >
          <Clipboard className="w-4 h-4" />
          {copySuccess ? 'Copied!' : 'Copy URL'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleParticipants}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showParticipants ? 'bg-brand-primary-600 text-white' : 'bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark'
          }`}
        >
          <Users className="w-4 h-4" />
          {participantsCount}
        </button>
        <button
          onClick={onToggleChat}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showChat ? 'bg-brand-primary-600 text-white' : 'bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>

        
      </div>
    </header>
  );
};

export default CallHeader;
