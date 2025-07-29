// socket/videoSignal.js - Complete with Enhanced Screen Sharing and Emoji Reactions
const Meeting = require('../models/Meeting');

function setupVideoSignaling(io) {
  // In-memory store for active rooms and participants
  const activeRooms = new Map(); // meetingId -> Map(socketId -> userInfo)
  
  console.log('🎥 Video signaling server initialized with screen sharing and emoji support');

  io.on('connection', (socket) => {
    console.log(`🔵 Video client connected: ${socket.id}`);

    // User joins a video meeting room
    socket.on('join-video-room', async ({ meetingId, user, groupId }) => {
      try {
        console.log(`👤 User ${user.username} joining video room: ${meetingId}`);
        
        // Join the socket room
        socket.join(meetingId);
        
        // Initialize room if it doesn't exist
        if (!activeRooms.has(meetingId)) {
          activeRooms.set(meetingId, new Map());
        }
        
        // Add user to room with screen sharing state
        activeRooms.get(meetingId).set(socket.id, {
          ...user,
          joinedAt: new Date(),
          isAudioOn: true,
          isVideoOn: true,
          isScreenSharing: false // ✅ ADD THIS: Track screen sharing state
        });

        // Update or create meeting in database
        await Meeting.findOneAndUpdate(
          { meetingId },
          {
            $setOnInsert: {
              meetingId,
              groupId,
              createdBy: user.id,
              createdAt: new Date()
            },
            $addToSet: { participants: user.id },
            status: 'active',
            lastActivity: new Date()
          },
          { upsert: true, new: true }
        );

        // Get current participants in room
        const roomParticipants = Array.from(activeRooms.get(meetingId).entries())
          .map(([socketId, userInfo]) => ({
            socketId,
            user: userInfo
          }));

        // Send existing participants to the new user
        socket.emit('existing-participants', roomParticipants.filter(p => p.socketId !== socket.id));
        
        // Notify existing participants about new user
        socket.to(meetingId).emit('user-joined-video', {
          socketId: socket.id,
          user: activeRooms.get(meetingId).get(socket.id)
        });

        // Send updated participant count to room
        io.to(meetingId).emit('participant-count-updated', {
          count: roomParticipants.length
        });

        console.log(`✅ User ${user.username} successfully joined room ${meetingId} (Total: ${roomParticipants.length})`);
        
      } catch (error) {
        console.error('❌ Error joining video room:', error);
        socket.emit('join-error', { error: error.message });
      }
    });

    // WebRTC signaling: Handle offers, answers, and ICE candidates
    socket.on('webrtc-signal', ({ meetingId, to, signal, type }) => {
      console.log(`📡 WebRTC signal (${type}) from ${socket.id} to ${to}`);
      
      // Forward the signal to the target peer
      socket.to(to).emit('webrtc-signal', {
        from: socket.id,
        signal,
        type
      });
    });

    // Handle audio/video state changes
    socket.on('toggle-audio', ({ meetingId, isAudioOn }) => {
      if (activeRooms.has(meetingId) && activeRooms.get(meetingId).has(socket.id)) {
        const participant = activeRooms.get(meetingId).get(socket.id);
        participant.isAudioOn = isAudioOn;
        
        console.log(`🎤 User ${participant.username} ${isAudioOn ? 'unmuted' : 'muted'} in ${meetingId}`);
        
        // Broadcast audio state to other participants
        socket.to(meetingId).emit('participant-audio-changed', {
          socketId: socket.id,
          isAudioOn
        });
      }
    });

    socket.on('toggle-video', ({ meetingId, isVideoOn }) => {
      if (activeRooms.has(meetingId) && activeRooms.get(meetingId).has(socket.id)) {
        const participant = activeRooms.get(meetingId).get(socket.id);
        participant.isVideoOn = isVideoOn;
        
        console.log(`📹 User ${participant.username} ${isVideoOn ? 'enabled' : 'disabled'} video in ${meetingId}`);
        
        // Broadcast video state to other participants
        socket.to(meetingId).emit('participant-video-changed', {
          socketId: socket.id,
          isVideoOn
        });
      }
    });

    // ✅ ENHANCED: Handle screen sharing with state tracking
    socket.on('start-screen-share', ({ meetingId }) => {
      if (activeRooms.has(meetingId) && activeRooms.get(meetingId).has(socket.id)) {
        const participant = activeRooms.get(meetingId).get(socket.id);
        participant.isScreenSharing = true;
        
        console.log(`🖥️ User ${participant.username} started screen sharing in ${meetingId}`);
        
        // Notify other participants
        socket.to(meetingId).emit('user-started-screen-share', {
          socketId: socket.id,
          username: participant.username
        });

        // Update meeting activity
        Meeting.findOneAndUpdate(
          { meetingId },
          { lastActivity: new Date() }
        ).catch(err => console.error('Error updating meeting activity:', err));
      }
    });

    socket.on('stop-screen-share', ({ meetingId }) => {
      if (activeRooms.has(meetingId) && activeRooms.get(meetingId).has(socket.id)) {
        const participant = activeRooms.get(meetingId).get(socket.id);
        participant.isScreenSharing = false;
        
        console.log(`🛑 User ${participant.username} stopped screen sharing in ${meetingId}`);
        
        // Notify other participants
        socket.to(meetingId).emit('user-stopped-screen-share', {
          socketId: socket.id,
          username: participant.username
        });

        // Update meeting activity
        Meeting.findOneAndUpdate(
          { meetingId },
          { lastActivity: new Date() }
        ).catch(err => console.error('Error updating meeting activity:', err));
      }
    });

    // Handle meeting chat messages
    socket.on('send-meeting-message', ({ meetingId, message, user }) => {
      const messageData = {
        id: Date.now(),
        content: message,
        sender: user.username,
        timestamp: new Date().toISOString(),
        socketId: socket.id
      };

      console.log(`💬 Message in ${meetingId} from ${user.username}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);

      // Broadcast message to all participants in the meeting
      io.to(meetingId).emit('meeting-message-received', messageData);

      // Update meeting activity
      Meeting.findOneAndUpdate(
        { meetingId },
        { lastActivity: new Date() }
      ).catch(err => console.error('Error updating meeting activity:', err));
    });

    // ✅ UPDATED: Handle emoji reactions with proper validation
    socket.on('emoji-reaction', ({ meetingId, emoji, sender, x, y, timestamp }) => {
      console.log(`😀 Emoji reaction in ${meetingId} from ${sender}: ${emoji} at position (${x}, ${y})`);
      
      // ✅ IMPORTANT: Verify the user is in the meeting room
      if (activeRooms.has(meetingId) && activeRooms.get(meetingId).has(socket.id)) {
        // Broadcast emoji reaction to all OTHER participants in the meeting
        socket.to(meetingId).emit('emoji-reaction', {
          emoji,
          sender,
          x,
          y,
          timestamp
        });

        console.log(`✅ Broadcasted emoji ${emoji} to room ${meetingId}`);

        // Update meeting activity
        Meeting.findOneAndUpdate(
          { meetingId },
          { lastActivity: new Date() }
        ).catch(err => console.error('Error updating meeting activity:', err));
      } else {
        console.log(`❌ User ${socket.id} not found in meeting ${meetingId}`);
      }
    });

    // Handle manual leave
    socket.on('leave-video-room', async ({ meetingId }) => {
      await handleUserLeave(socket, meetingId);
    });

    // Handle disconnect
    socket.on('disconnecting', async () => {
      console.log(`🔴 Video client disconnecting: ${socket.id}`);
      
      // Find all rooms this socket was in and clean up
      for (const meetingId of socket.rooms) {
        if (activeRooms.has(meetingId)) {
          await handleUserLeave(socket, meetingId);
        }
      }
    });

    // ✅ ENHANCED: Helper function to handle user leaving with screen sharing cleanup
    async function handleUserLeave(socket, meetingId) {
      try {
        if (!activeRooms.has(meetingId)) return;

        const user = activeRooms.get(meetingId).get(socket.id);
        if (!user) return;

        // ✅ NEW: If user was screen sharing, notify others they stopped
        if (user.isScreenSharing) {
          console.log(`🛑 User ${user.username} stopped screen sharing due to leaving ${meetingId}`);
          socket.to(meetingId).emit('user-stopped-screen-share', {
            socketId: socket.id,
            username: user.username
          });
        }

        // Remove user from room
        activeRooms.get(meetingId).delete(socket.id);
        socket.leave(meetingId);

        // Notify other participants
        socket.to(meetingId).emit('user-left-video', {
          socketId: socket.id,
          user
        });

        // Update participant count
        const remainingCount = activeRooms.get(meetingId).size;
        socket.to(meetingId).emit('participant-count-updated', {
          count: remainingCount
        });

        // If room is empty, mark meeting as ended
        if (remainingCount === 0) {
          activeRooms.delete(meetingId);
          
          await Meeting.findOneAndUpdate(
            { meetingId },
            {
              status: 'ended',
              endedAt: new Date()
            }
          );
          
          console.log(`🏁 Meeting ${meetingId} ended - no participants remaining`);
        } else {
          // Update meeting activity for remaining participants
          await Meeting.findOneAndUpdate(
            { meetingId },
            { lastActivity: new Date() }
          );
        }

        console.log(`👋 User ${user.username} left room ${meetingId} (Remaining: ${remainingCount})`);
        
      } catch (error) {
        console.error('❌ Error handling user leave:', error);
      }
    }

    // ✅ NEW: Handle connection errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });

    // ✅ NEW: Heartbeat for connection monitoring
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // ✅ NEW: Periodic cleanup of stale meetings (optional)
  setInterval(async () => {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      await Meeting.updateMany(
        { 
          status: 'active', 
          lastActivity: { $lt: cutoffTime } 
        },
        { 
          status: 'ended',
          endedAt: new Date()
        }
      );
    } catch (error) {
      console.error('❌ Error cleaning up stale meetings:', error);
    }
  }, 60 * 60 * 1000); // Run every hour
}

module.exports = setupVideoSignaling;
