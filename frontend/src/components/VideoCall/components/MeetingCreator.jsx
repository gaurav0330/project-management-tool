// components/VideoCall/MeetingCreator.jsx
import React, { useState } from 'react';
import { Video, Users, Copy, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '../../../../lib/utils';

const MeetingCreator = ({ onCreateMeeting, userRole, groupId }) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState(null);

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    
    // Generate meeting ID and details
    const meetingId = `meeting_${Date.now()}`;
    const meetingData = {
      id: meetingId,
      title: meetingTitle || 'Team Video Call',
      createdBy: userRole,
      groupId: groupId,
      createdAt: new Date().toISOString(),
      joinLink: `/videocall?meeting=${meetingId}`,
      participants: []
    };

    // This would typically be an API call
    setTimeout(() => {
      setCreatedMeeting(meetingData);
      setIsCreating(false);
      onCreateMeeting(meetingData);
    }, 1000);
  };

  const copyMeetingLink = () => {
    if (createdMeeting) {
      navigator.clipboard.writeText(`${window.location.origin}${createdMeeting.joinLink}`);
      // Could add toast notification here
    }
  };

  if (createdMeeting) {
    return (
      <div className="bg-bg-secondary-light/70 dark:bg-bg-secondary-dark/80 rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-brand-primary-600 rounded-full flex items-center justify-center mx-auto">
            <Video className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold text-heading-primary-light dark:text-heading-primary-dark">
              Meeting Created Successfully!
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm mt-1">
              {createdMeeting.title}
            </p>
          </div>

          <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                Meeting ID:
              </span>
              <span className="font-mono text-sm text-brand-primary-600 dark:text-brand-primary-400">
                {createdMeeting.id}
              </span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}${createdMeeting.joinLink}`}
                readOnly
                className="flex-1 px-3 py-2 text-xs font-mono bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/30 dark:border-gray-700/30 rounded-lg text-txt-primary-light dark:text-txt-primary-dark"
              />
              <Button onClick={copyMeetingLink} size="sm" variant="ghost">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => window.open(createdMeeting.joinLink, '_blank')}
              className="flex-1 bg-brand-primary-600 hover:bg-brand-primary-700 text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Meeting
            </Button>
            <Button
              onClick={() => setCreatedMeeting(null)}
              variant="outline"
              className="flex-1"
            >
              Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary-light/70 dark:bg-bg-secondary-dark/80 rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
      <div className="text-center space-y-6">
        <div>
          <div className="w-16 h-16 bg-brand-accent-100 dark:bg-brand-accent-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-brand-accent-600 dark:text-brand-accent-400" />
          </div>
          <h2 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
            Create Video Meeting
          </h2>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
            Start a video conference for your team
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark mb-2">
              Meeting Title (Optional)
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Team Standup Meeting"
              className="w-full px-4 py-3 rounded-lg border border-gray-200/30 dark:border-gray-700/30 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-secondary-light dark:placeholder-txt-secondary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
            />
          </div>

          <Button
            onClick={handleCreateMeeting}
            disabled={isCreating}
            className="w-full bg-brand-primary-600 hover:bg-brand-primary-700 text-white py-3 text-lg font-semibold disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Creating Meeting...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Create Meeting Room
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
          Only Project Managers can create meetings
        </div>
      </div>
    </div>
  );
};

export default MeetingCreator;
