// socket/mediasoupServer.js
const mediasoup = require('mediasoup');

class MediasoupServer {
  constructor() {
    this.worker = null;
    this.router = null;
    this.rooms = new Map(); // roomId -> Room instance
  }

  async init() {
    console.log('🎬 Initializing Mediasoup server...');
    
    // Create a Mediasoup Worker
    this.worker = await mediasoup.createWorker({
      logLevel: 'warn',
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
    });

    this.worker.on('died', () => {
      console.error('❌ Mediasoup worker died, exiting in 2 seconds... [pid:%d]', this.worker.pid);
      setTimeout(() => process.exit(1), 2000);
    });

    // Create a Router
    const mediaCodecs = [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
    ];

    this.router = await this.worker.createRouter({ mediaCodecs });

    console.log('✅ Mediasoup server initialized successfully');
    return this;
  }

  async createRoom(roomId) {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId);
    }

    console.log(`🏠 Creating new Mediasoup room: ${roomId}`);
    
    const room = {
      id: roomId,
      router: this.router,
      peers: new Map(), // socketId -> Peer
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId) {
    console.log(`🗑️ Deleting room: ${roomId}`);
    this.rooms.delete(roomId);
  }

  // Get Router RTP Capabilities (needed by clients)
  getRouterRtpCapabilities() {
    return this.router.rtpCapabilities;
  }
}

// Export singleton instance
const mediasoupServer = new MediasoupServer();
module.exports = mediasoupServer;
