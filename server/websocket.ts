import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface ConnectedUser {
  id: string;
  name: string;
  role: 'admin' | 'student';
  email: string;
  connectedAt: Date;
  lastActivity: Date;
}

interface DashboardData {
  liveUsers: ConnectedUser[];
  totalUsers: number;
  activeTests: number;
  completedToday: number;
  recentActivity: {
    user: string;
    action: string;
    timestamp: Date;
  }[];
}

export class DashboardWebSocket {
  private wss: WebSocketServer;
  private connectedUsers = new Map<WebSocket, ConnectedUser>();
  private adminSockets = new Set<WebSocket>();
  private studentSockets = new Set<WebSocket>();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      verifyClient: (info) => {
        // Basic verification - in production, verify JWT tokens
        return true;
      }
    });

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocket, request: any) {
    console.log('New WebSocket connection established');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Invalid JSON message:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send initial connection acknowledgment
    this.sendMessage(ws, {
      type: 'connection_established',
      timestamp: new Date()
    });
  }

  private handleMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'auth':
        this.handleAuth(ws, message.user);
        break;
      case 'test_started':
        this.handleTestStarted(ws, message);
        break;
      case 'test_completed':
        this.handleTestCompleted(ws, message);
        break;
      case 'activity':
        this.handleActivity(ws, message);
        break;
      case 'ping':
        this.sendMessage(ws, { type: 'pong', timestamp: new Date() });
        break;
    }
  }

  private handleAuth(ws: WebSocket, user: any) {
    const connectedUser: ConnectedUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      connectedAt: new Date(),
      lastActivity: new Date()
    };

    this.connectedUsers.set(ws, connectedUser);

    if (user.role === 'admin') {
      this.adminSockets.add(ws);
    } else {
      this.studentSockets.add(ws);
    }

    // Send updated dashboard data to all admins
    this.broadcastToDashboard();

    // Send welcome message
    this.sendMessage(ws, {
      type: 'auth_success',
      user: connectedUser,
      timestamp: new Date()
    });
  }

  private handleTestStarted(ws: WebSocket, message: any) {
    const user = this.connectedUsers.get(ws);
    if (!user) return;

    const activity = {
      user: user.name,
      action: `Started test: ${message.testTitle}`,
      timestamp: new Date()
    };

    this.broadcastToDashboard({ newActivity: activity });
  }

  private handleTestCompleted(ws: WebSocket, message: any) {
    const user = this.connectedUsers.get(ws);
    if (!user) return;

    const activity = {
      user: user.name,
      action: `Completed test: ${message.testTitle} (Score: ${message.score}%)`,
      timestamp: new Date()
    };

    this.broadcastToDashboard({ newActivity: activity });
  }

  private handleActivity(ws: WebSocket, message: any) {
    const user = this.connectedUsers.get(ws);
    if (user) {
      user.lastActivity = new Date();
    }
  }

  private handleDisconnection(ws: WebSocket) {
    const user = this.connectedUsers.get(ws);
    if (user) {
      console.log(`User ${user.name} disconnected`);
      this.connectedUsers.delete(ws);
      this.adminSockets.delete(ws);
      this.studentSockets.delete(ws);
      
      // Update dashboard data
      this.broadcastToDashboard();
    }
  }

  private sendMessage(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcastToDashboard(additionalData?: any) {
    const liveUsers = Array.from(this.connectedUsers.values());
    
    const dashboardData: DashboardData = {
      liveUsers,
      totalUsers: liveUsers.length,
      activeTests: liveUsers.filter(u => u.role === 'student').length,
      completedToday: Math.floor(Math.random() * 50) + 10, // Mock data for demo
      recentActivity: this.getRecentActivity()
    };

    const message = {
      type: 'dashboard_update',
      data: dashboardData,
      timestamp: new Date(),
      ...additionalData
    };

    // Send to all admin connections
    this.adminSockets.forEach(ws => {
      this.sendMessage(ws, message);
    });
  }

  private getRecentActivity() {
    // In a real app, this would come from a database
    return [
      { user: 'Demo Student', action: 'Completed Python Basics Quiz', timestamp: new Date(Date.now() - 5 * 60000) },
      { user: 'Alice Johnson', action: 'Started Data Structures Test', timestamp: new Date(Date.now() - 10 * 60000) },
      { user: 'Bob Smith', action: 'Completed Algorithm Assessment', timestamp: new Date(Date.now() - 15 * 60000) },
    ];
  }

  public broadcastToStudents(message: any) {
    this.studentSockets.forEach(ws => {
      this.sendMessage(ws, message);
    });
  }

  public getConnectedUsers(): ConnectedUser[] {
    return Array.from(this.connectedUsers.values());
  }
}