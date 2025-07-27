// components/ParticipantsSidebar.jsx
import React from 'react';
import { UserPlus, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const ParticipantsSidebar = ({ participants, currentUser, userRole, isMuted, isVideoOn }) => {
  return (
    <div className="w-80 bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/90 backdrop-blur-xl border-l border-gray-200/30 dark:border-gray-700/30 flex flex-col">
      <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
          Participants ({participants.length + 1})
        </h3>
        <button className="w-full bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors">
          <UserPlus className="w-4 h-4" />
          Invite Others
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Current User */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary-light/50 dark:bg-bg-primary-dark/50 border border-gray-200/20 dark:border-gray-700/20">
          <div className="w-10 h-10 bg-brand-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {currentUser?.username?.split(' ').map(n => n[0]).join('') || 'You'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark truncate">
              {currentUser?.username || 'You'} (You)
            </p>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
              {userRole?.replace('_', ' ') || 'User'}
            </p>
          </div>
          <div className="flex gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              !isMuted ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
            }`}>
              {!isMuted ? 
                <Mic className="w-3 h-3 text-green-600 dark:text-green-400" /> : 
                <MicOff className="w-3 h-3 text-red-600 dark:text-red-400" />
              }
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isVideoOn ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
            }`}>
              {isVideoOn ? 
                <Video className="w-3 h-3 text-green-600 dark:text-green-400" /> : 
                <VideoOff className="w-3 h-3 text-red-600 dark:text-red-400" />
              }
            </div>
          </div>
        </div>

        {/* Other Participants */}
        {participants.map((participant) => (
          <div key={participant.socketId} className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary-light/50 dark:bg-bg-primary-dark/50 border border-gray-200/20 dark:border-gray-700/20">
            <div className="w-10 h-10 bg-brand-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {participant.user.username.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark truncate">
                {participant.user.username}
              </p>
              <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                {participant.user.role.replace('_', ' ')}
              </p>
            </div>
            <div className="flex gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                participant.user.isAudioOn ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
              }`}>
                {participant.user.isAudioOn ? 
                  <Mic className="w-3 h-3 text-green-600 dark:text-green-400" /> : 
                  <MicOff className="w-3 h-3 text-red-600 dark:text-red-400" />
                }
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                participant.user.isVideoOn ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
              }`}>
                {participant.user.isVideoOn ? 
                  <Video className="w-3 h-3 text-green-600 dark:text-green-400" /> : 
                  <VideoOff className="w-3 h-3 text-red-600 dark:text-red-400" />
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsSidebar;
