import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@app/common/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '@app/common/database/entities/room.entity';
import { MessageEntity } from '@app/common/database/entities/message.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([RoomEntity, MessageEntity]),
    UserModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
