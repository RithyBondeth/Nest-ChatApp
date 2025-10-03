import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@app/common/jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
