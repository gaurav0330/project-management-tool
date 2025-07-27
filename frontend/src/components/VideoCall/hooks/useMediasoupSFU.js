// hooks/useMediasoupSFU.js - Fixed Mediasoup SFU Implementation
import { useState, useEffect, useRef } from 'react';
import { Device } from 'mediasoup-client';
import io from 'socket.io-client';

const useMediasoupSFU = (meetingId, currentUser, isCallActive) => {
  const [peers, setPeers] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [meetingMessages, setMeetingMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef();
  const deviceRef = useRef();
  const sendTransportRef = useRef();
  const recvTransportRef = useRef();
  const producersRef = useRef(new Map());
  const consumersRef = useRef(new Map());
  const localVideoRef = useRef();

  const initializeLocalStream = async () => {
    try {
      console.log('🎥 Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('✅ Local stream obtained:', stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      return null;
    }
  };

  const initializeDevice = async () => {
    try {
      console.log('🔧 Initializing Mediasoup device...');
      
      deviceRef.current = new Device();
      
      // Get router capabilities from server
      const routerRtpCapabilities = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout getting router capabilities'));
        }, 5000);

        socketRef.current.emit('getRouterRtpCapabilities', (capabilities) => {
          clearTimeout(timeout);
          if (capabilities.error) {
            reject(new Error(capabilities.error));
          } else {
            resolve(capabilities);
          }
        });
      });

      // Load device with router capabilities
      await deviceRef.current.load({ routerRtpCapabilities });
      
      console.log('✅ Mediasoup device initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing device:', error);
      return false;
    }
  };

  const createSendTransport = async () => {
    try {
      console.log('🚛 Creating send transport...');
      
      const transportInfo = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout creating send transport'));
        }, 10000);

        socketRef.current.emit('createWebRtcTransport', 
          { meetingId, direction: 'send' }, 
          (response) => {
            clearTimeout(timeout);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          }
        );
      });

      const sendTransport = deviceRef.current.createSendTransport(transportInfo);
      
      // Set up transport event handlers
      sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          console.log('🔗 Connecting send transport...');
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Timeout connecting send transport'));
            }, 5000);

            socketRef.current.emit('connectTransport', 
              { meetingId, transportId: sendTransport.id, dtlsParameters },
              (response) => {
                clearTimeout(timeout);
                if (response?.error) {
                  reject(new Error(response.error));
                } else {
                  resolve();
                }
              }
            );
          });
          console.log('✅ Send transport connected');
          callback();
        } catch (error) {
          console.error('❌ Error connecting send transport:', error);
          errback(error);
        }
      });

      sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
          console.log(`📤 Producing ${kind} media...`);
          const { id } = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error(`Timeout producing ${kind}`));
            }, 5000);

            socketRef.current.emit('produce', {
              meetingId,
              transportId: sendTransport.id,
              kind,
              rtpParameters,
            }, (response) => {
              clearTimeout(timeout);
              if (response.error) {
                reject(new Error(response.error));
              } else {
                resolve(response);
              }
            });
          });
          console.log(`✅ ${kind} producer created with ID: ${id}`);
          callback({ id });
        } catch (error) {
          console.error(`❌ Error producing ${kind}:`, error);
          errback(error);
        }
      });

      sendTransportRef.current = sendTransport;
      console.log('✅ Send transport created and stored');
      return sendTransport;
    } catch (error) {
      console.error('❌ Error creating send transport:', error);
      return null;
    }
  };

  const createRecvTransport = async () => {
    try {
      console.log('🚛 Creating receive transport...');
      
      const transportInfo = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout creating receive transport'));
        }, 10000);

        socketRef.current.emit('createWebRtcTransport', 
          { meetingId, direction: 'recv' }, 
          (response) => {
            clearTimeout(timeout);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          }
        );
      });

      const recvTransport = deviceRef.current.createRecvTransport(transportInfo);
      
      recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          console.log('🔗 Connecting receive transport...');
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Timeout connecting receive transport'));
            }, 5000);

            socketRef.current.emit('connectTransport', 
              { meetingId, transportId: recvTransport.id, dtlsParameters },
              (response) => {
                clearTimeout(timeout);
                if (response?.error) {
                  reject(new Error(response.error));
                } else {
                  resolve();
                }
              }
            );
          });
          console.log('✅ Receive transport connected');
          callback();
        } catch (error) {
          console.error('❌ Error connecting receive transport:', error);
          errback(error);
        }
      });

      recvTransportRef.current = recvTransport;
      console.log('✅ Receive transport created and stored');
      return recvTransport;
    } catch (error) {
      console.error('❌ Error creating receive transport:', error);
      return null;
    }
  };

  const startProducing = async (stream) => {
    try {
      const sendTransport = sendTransportRef.current;
      if (!sendTransport) {
        throw new Error('Send transport not available');
      }

      console.log('📤 Starting to produce media...');

      // Wait a bit to ensure transport is fully connected
      await new Promise(resolve => setTimeout(resolve, 100));

      // Produce video
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && deviceRef.current.canProduce('video')) {
        console.log('📤 Producing video track...');
        const videoProducer = await sendTransport.produce({
          track: videoTrack,
          encodings: [
            { maxBitrate: 100000 },
            { maxBitrate: 300000 },
            { maxBitrate: 900000 }
          ],
          codecOptions: {
            videoGoogleStartBitrate: 1000
          }
        });
        
        producersRef.current.set('video', videoProducer);
        console.log('✅ Video producer created:', videoProducer.id);
      } else {
        console.log('⚠️ Cannot produce video or no video track available');
      }

      // Produce audio
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack && deviceRef.current.canProduce('audio')) {
        console.log('📤 Producing audio track...');
        const audioProducer = await sendTransport.produce({
          track: audioTrack
        });
        
        producersRef.current.set('audio', audioProducer);
        console.log('✅ Audio producer created:', audioProducer.id);
      } else {
        console.log('⚠️ Cannot produce audio or no audio track available');
      }

      console.log('🎉 Media production completed');

    } catch (error) {
      console.error('❌ Error producing media:', error);
      throw error;
    }
  };

  const consumeMedia = async (socketId, producerId, kind) => {
    try {
      const recvTransport = recvTransportRef.current;
      if (!recvTransport) {
        throw new Error('Receive transport not available');
      }

      console.log(`📥 Consuming ${kind} from ${socketId}`);

      const consumerInfo = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Timeout consuming ${kind} from ${socketId}`));
        }, 5000);

        socketRef.current.emit('consume', {
          meetingId,
          producerId,
          rtpCapabilities: deviceRef.current.rtpCapabilities,
        }, (response) => {
          clearTimeout(timeout);
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
      });

      const consumer = await recvTransport.consume({
        id: consumerInfo.id,
        producerId: consumerInfo.producerId,
        kind: consumerInfo.kind,
        rtpParameters: consumerInfo.rtpParameters,
      });

      // Store consumer
      if (!consumersRef.current.has(socketId)) {
        consumersRef.current.set(socketId, new Map());
      }
      consumersRef.current.get(socketId).set(kind, consumer);

      // Create or update peer with stream
      const stream = new MediaStream();
      stream.addTrack(consumer.track);

      setPeers(prev => {
        const newPeers = new Map(prev);
        const existingPeer = newPeers.get(socketId) || { streams: new Map(), user: null };
        existingPeer.streams.set(kind, stream);
        
        // Combine audio and video streams for display
        if (existingPeer.streams.has('video') || existingPeer.streams.has('audio')) {
          const combinedStream = new MediaStream();
          existingPeer.streams.forEach(s => {
            s.getTracks().forEach(track => combinedStream.addTrack(track));
          });
          existingPeer.stream = combinedStream;
        }
        
        newPeers.set(socketId, existingPeer);
        console.log(`✅ Consumer added for ${socketId}. Total peers:`, newPeers.size);
        return newPeers;
      });

      // Resume consumer
      await consumer.resume();
      console.log(`✅ ${kind} consumer created and resumed for ${socketId}`);
      return consumer;
    } catch (error) {
      console.error(`❌ Error consuming ${kind} from ${socketId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    console.log("🎯 useMediasoupSFU initialized with:", { meetingId, currentUser, isCallActive });
    
    if (!meetingId || !currentUser || !isCallActive) {
      console.log("❌ Missing required data for SFU:", { meetingId, currentUser, isCallActive });
      return;
    }

    const initializeSFU = async () => {
      try {
        console.log("🔌 Connecting to SFU server...");
        socketRef.current = io('http://localhost:5000');

        // Wait for socket connection
        await new Promise((resolve) => {
          socketRef.current.on('connect', resolve);
        });
        console.log('✅ Socket connected');

        // Initialize local stream first
        const stream = await initializeLocalStream();
        if (!stream) {
          console.error('❌ Failed to get local stream');
          return;
        }

        // Initialize Mediasoup device
        const deviceInitialized = await initializeDevice();
        if (!deviceInitialized) {
          console.error('❌ Failed to initialize device');
          return;
        }

        // Create transports
        const sendTransport = await createSendTransport();
        const recvTransport = await createRecvTransport();

        if (!sendTransport || !recvTransport) {
          console.error('❌ Failed to create transports');
          return;
        }

        // Join room AFTER transports are ready
        socketRef.current.emit('join-video-room', {
          meetingId,
          user: currentUser,
          groupId: meetingId.split('_')[0]
        });

        // Start producing media AFTER joining room
        await startProducing(stream);

        setIsConnected(true);
        console.log('🎉 SFU initialization complete');

      } catch (error) {
        console.error('❌ Error initializing SFU:', error);
      }
    };

    initializeSFU();

    // Socket event listeners
    const handleExistingParticipants = (existingParticipants) => {
      console.log('📋 Existing SFU participants:', existingParticipants);
      setParticipants(existingParticipants);
      setParticipantCount(existingParticipants.length + 1);
    };

    const handleUserJoined = ({ socketId, user }) => {
      console.log('👤 SFU user joined:', user);
      setParticipants(prev => [...prev, { socketId, user }]);
    };

    const handleNewProducer = ({ socketId, producerId, kind }) => {
      console.log(`🆕 New producer from ${socketId}: ${kind}`);
      if (socketId !== socketRef.current?.id) {
        consumeMedia(socketId, producerId, kind);
      }
    };

    const handleUserLeft = ({ socketId }) => {
      console.log('👋 SFU user left:', socketId);
      
      // Clean up consumers
      const userConsumers = consumersRef.current.get(socketId);
      if (userConsumers) {
        userConsumers.forEach(consumer => consumer.close());
        consumersRef.current.delete(socketId);
      }
      
      // Remove from peers
      setPeers(prev => {
        const newPeers = new Map(prev);
        newPeers.delete(socketId);
        return newPeers;
      });
      
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    };

    const handleParticipantCountUpdated = ({ count }) => {
      setParticipantCount(count);
    };

    const handleParticipantAudioChanged = ({ socketId, isAudioOn }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId 
            ? { ...p, user: { ...p.user, isAudioOn } }
            : p
        )
      );
    };

    const handleParticipantVideoChanged = ({ socketId, isVideoOn }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId 
            ? { ...p, user: { ...p.user, isVideoOn } }
            : p
        )
      );
    };

    const handleMeetingMessage = (message) => {
      setMeetingMessages(prev => [...prev, message]);
    };

    // Set up event listeners after socket is connected
    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.on('existing-participants', handleExistingParticipants);
        socketRef.current.on('user-joined-video', handleUserJoined);
        socketRef.current.on('newProducer', handleNewProducer);
        socketRef.current.on('user-left-video', handleUserLeft);
        socketRef.current.on('participant-count-updated', handleParticipantCountUpdated);
        socketRef.current.on('participant-audio-changed', handleParticipantAudioChanged);
        socketRef.current.on('participant-video-changed', handleParticipantVideoChanged);
        socketRef.current.on('meeting-message-received', handleMeetingMessage);
      }
    }, 1000);

    return () => {
      console.log('🧹 Cleaning up SFU resources...');
      
      if (socketRef.current) {
        socketRef.current.emit('leave-video-room', { meetingId });
        socketRef.current.disconnect();
      }
      
      // Close producers
      producersRef.current.forEach(producer => {
        if (producer && !producer.closed) {
          producer.close();
        }
      });
      producersRef.current.clear();
      
      // Close consumers
      consumersRef.current.forEach(userConsumers => {
        userConsumers.forEach(consumer => {
          if (consumer && !consumer.closed) {
            consumer.close();
          }
        });
      });
      consumersRef.current.clear();
      
      // Close transports
      if (sendTransportRef.current && !sendTransportRef.current.closed) {
        sendTransportRef.current.close();
      }
      if (recvTransportRef.current && !recvTransportRef.current.closed) {
        recvTransportRef.current.close();
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [meetingId, currentUser, isCallActive]);

  const toggleAudio = (isAudioOn) => {
    const audioProducer = producersRef.current.get('audio');
    if (audioProducer) {
      if (isAudioOn) {
        audioProducer.resume();
      } else {
        audioProducer.pause();
      }
    }
    
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isAudioOn;
      });
    }
    
    socketRef.current?.emit('toggle-audio', { meetingId, isAudioOn });
  };

  const toggleVideo = (isVideoOn) => {
    const videoProducer = producersRef.current.get('video');
    if (videoProducer) {
      if (isVideoOn) {
        videoProducer.resume();
      } else {
        videoProducer.pause();
      }
    }
    
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
    
    socketRef.current?.emit('toggle-video', { meetingId, isVideoOn });
  };

  const sendMeetingMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit('send-meeting-message', {
        meetingId,
        message,
        user: currentUser
      });
    }
  };

  return {
    peers,
    localStream,
    localVideoRef,
    participants,
    participantCount,
    meetingMessages,
    toggleAudio,
    toggleVideo,
    sendMeetingMessage,
    isConnected
  };
};

export default useMediasoupSFU;
