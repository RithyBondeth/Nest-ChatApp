import {
  OnGatewayConnection,
  OnGatewayDisconnect,
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
    if(userId) {
      this.userSockets.delete(userId);
      await this.userService.updateStatus(userId, TChatStatus.OFFLINE);
      this.server.emit('userOffline', { userId });
    }
    console.log(`Client disconnected: ${client.id}`);
  }
}
