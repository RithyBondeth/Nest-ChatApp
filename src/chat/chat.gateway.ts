import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@app/common/jwt/jwt.service';
import { IPayload } from '@app/common/jwt/interfaces/payload.interface';
import { UserService } from 'src/user/user.service';
import { TChatStatus } from '@app/common/database/enums/status.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly userSockets: Map<string, string> = new Map(); // userID -> socketID

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload: IPayload = await this.jwtService.verifyToken(token);
      const userId = payload.id;

      this.userSockets.set(userId.toString(), client.id);
      client.data.userId = userId;
      client.data.name = payload.username;

      await this.userService.updateStatus(
        userId.toString(),
        TChatStatus.ONLINE,
      );

      //Join user's room
      const rooms = await this.chatService.findUserRooms(userId.toString());
      rooms.forEach((room) => {
        client.join(room.id.toString());
      });

      this.server.emit('userOnline', { userId, username: payload.username });
      console.log(`Client connected: ${client.id}, User: ${payload.username}`);
    } catch (error) {
      console.log(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      await this.userService.updateStatus(userId, TChatStatus.OFFLINE);
      this.server.emit('userOffline', { userId });
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: string; content: string; type?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const username = client.data.username;

    const message = await this.chatService.createMessage(
      data.roomId,
      userId,
      username,
      data.content,
      data.type || 'text',
    );

    // Emit to all users in the room
    this.server.to(data.roomId).emit('newMessage', {
      id: message.id.toString(),
      roomId: message.roomId.toString(),
      senderId: message.senderId.toString(),
      senderName: message.senderName,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt,
    });

    return { success: true, message };
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);

    const messages = await this.chatService.findRoomMessage(data.roomId);

    return {
      success: true,
      message: messages.reverse().map((msg) => ({
        id: msg.id.toString(),
        roomId: msg.roomId.toString(),
        senderId: msg.senderId.toString(),
        senderName: msg.senderName,
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
      })),
    };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    return { success: true };
  }
}
