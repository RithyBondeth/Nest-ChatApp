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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

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

    } catch (error) {}
  }

  async handleDisconnect(client: any) {}
}
