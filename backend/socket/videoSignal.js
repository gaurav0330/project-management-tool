// socket/videoSignal.js
const Meeting = require('../models/Meeting'); // We'll create this model

function setupVideoSignaling(io) {
  // In-memory store for active rooms and participants
  const activeRooms = new Map(); // meetingId -> Map(socketId -> userInfo)
  
  console.log('🎥 Video signaling server initialized');

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
        
        // Add user to room
        activeRooms.get(meetingId).set(socket.id, {
          ...user,
          joinedAt: new Date(),
          isAudioOn: true,
          isVideoOn: true
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

        console.log(`✅ User ${user.username} successfully joined room ${meetingId}`);
        
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
        activeRooms.get(meetingId).get(socket.id).isAudioOn = isAudioOn;
        
        // Broadcast audio state to other participants
        socket.to(meetingId).emit('participant-audio-changed', {
          socketId: socket.id,
          isAudioOn
        });
      }
    });

    socket.on('toggle-video', ({ meetingId, isVideoOn }) => {
      if (activeRooms.has(meetingId) && activeRooms.get(meetingId).has(socket.id)) {
        activeRooms.get(meetingId).get(socket.id).isVideoOn = isVideoOn;
        
        // Broadcast video state to other participants
        socket.to(meetingId).emit('participant-video-changed', {
          socketId: socket.id,
          isVideoOn
        });
      }
    });

    // Handle screen sharing
    socket.on('start-screen-share', ({ meetingId }) => {
      socket.to(meetingId).emit('user-started-screen-share', {
        socketId: socket.id
      });
    });

    socket.on('stop-screen-share', ({ meetingId }) => {
      socket.to(meetingId).emit('user-stopped-screen-share', {
        socketId: socket.id
      });
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

      // Broadcast message to all participants in the meeting
      io.to(meetingId).emit('meeting-message-received', messageData);
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

    // Helper function to handle user leaving
    async function handleUserLeave(socket, meetingId) {
      try {
        if (!activeRooms.has(meetingId)) return;

        const user = activeRooms.get(meetingId).get(socket.id);
        if (!user) return;

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
        }

        console.log(`👋 User ${user.username} left room ${meetingId}`);
        
      } catch (error) {
        console.error('❌ Error handling user leave:', error);
      }
    }
  });
}

module.exports = setupVideoSignaling;
