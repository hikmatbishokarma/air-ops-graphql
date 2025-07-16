import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // or specify your frontend URL
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🟢 Client connected: ${client.id}`);

    // Optional: Join client to a role or user room
    // You’ll need to emit role/user info from frontend after connect
    client.on('joinRoom', (room: string) => {
      client.join(room);
      console.log(`Client ${client.id} joined room ${room}`);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Client disconnected: ${client.id}`);
  }

  // Called from system.service.ts
  broadcastNotification(notification: any) {
    const { recipientRoles = [], recipientIds = [] } = notification;

    recipientRoles.forEach((role: string) => {
      this.server.to(`role:${role}`).emit('notification:new', notification);
    });

    recipientIds.forEach((userId: string) => {
      this.server.to(`user:${userId}`).emit('notification:new', notification);
    });
  }
}
