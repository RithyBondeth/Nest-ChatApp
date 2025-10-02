import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { JwtService } from '@app/common/jwt/jwt.service';
import { IPayload } from '@app/common/jwt/interfaces/payload.interface';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService, private readonly jwtService: JwtService) {}
  
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if(!token) {
        client.disconnect();
        return;
      }

      const payload: IPayload = await this.jwtService.verifyToken(token);
      const userId = payload.id;
    } catch (error) {

    }
  }

  async handleDisconnect(client: any) {
      
  }
}
