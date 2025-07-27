// components/VideoGrid.jsx
import React, { useEffect, useRef } from 'react';

const VideoGrid = ({ peers, localVideoRef, currentUser, isVideoOn }) => {
  const remoteVideoRefs = useRef(new Map());

  // Convert peers Map to array for easier handling
  const peerArray = Array.from(peers.entries());
  
  console.log('🎬 VideoGrid render - Peers count:', peerArray.length);
  console.log('🎬 Peers data:', peerArray);

  // Update remote video elements when peers change
  useEffect(() => {
    console.log('🔄 Updating remote video elements, peers:', peerArray.length);
    
    peerArray.forEach(([socketId, peerData]) => {
      const videoElement = remoteVideoRefs.current.get(socketId);
      
      if (videoElement && peerData.stream) {
        console.log(`📺 Setting stream for ${peerData.user?.username || socketId}`);
        videoElement.srcObject = peerData.stream;
        
        videoElement.play().catch(error => {
          console.log('Video play failed:', error);
        });
      } else {
        console.log(`⚠️ Missing video element or stream for ${socketId}`, {
          hasVideoElement: !!videoElement,
          hasStream: !!peerData.stream
        });
      }
    });
  }, [peers]);

  // Dynamic grid layout for multiple users
  let gridClass = 'grid gap-4 h-full p-4';
  if (peerArray.length === 0) gridClass += ' grid-cols-1';
  else if (peerArray.length === 1) gridClass += ' grid-cols-2';
  else if (peerArray.length <= 3) gridClass += ' grid-cols-2';
  else if (peerArray.length <= 8) gridClass += ' grid-cols-3'; // For 4-8 users
  else gridClass += ' grid-cols-4'; // For 9+ users

  return (
    <div className={gridClass}>
      {/* Remote Videos */}
      {peerArray.map(([socketId, peerData]) => (
        <div key={socketId} className="relative bg-gray-800 rounded-2xl overflow-hidden">
          <video
            ref={(el) => {
              if (el) {
                remoteVideoRefs.current.set(socketId, el);
                if (peerData.stream) {
                  el.srcObject = peerData.stream;
                  el.play().catch(console.error);
                }
              }
            }}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={false} // Allow audio from remote participants
          />
          
          {/* Participant Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm font-medium">
              {peerData.user?.username || `Participant`}
            </span>
          </div>
          
          {/* Debug Info (remove in production) */}
          <div className="absolute top-2 left-2 bg-red-600/80 text-white text-xs px-2 py-1 rounded">
            {peerData.stream ? 'Stream ✅' : 'No Stream ❌'}
          </div>
        </div>
      ))}

      {/* Local Video */}
      <div className="relative bg-gray-800 rounded-2xl overflow-hidden">
        <video
          ref={localVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={true} // Always mute local video to prevent feedback
          playsInline
        />
        
        {!isVideoOn && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="w-16 h-16 bg-brand-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {currentUser?.username?.charAt(0)?.toUpperCase() || 'You'}
              </span>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-sm font-medium">You</span>
        </div>
        
        {/* Debug Info for Local Video */}
        <div className="absolute top-2 right-2 bg-green-600/80 text-white text-xs px-2 py-1 rounded">
          Local {isVideoOn ? '✅' : '❌'}
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;
