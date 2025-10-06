import { MessageEntity } from '@app/common/database/entities/message.entity';
import { RoomEntity } from '@app/common/database/entities/room.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async createRoom(
    name: string,
    type: string,
    participants: string[],
    createBy: string,
  ): Promise<RoomEntity> {
    try {
      const room = this.roomRepository.create({
        name: name,
        type: type,
        participants: participants.map((id: string) => new ObjectId(id)),
        createdBy: new ObjectId(createBy),
      });
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new BadRequestException('Failed to create room');
    }
  }

  async findOneRoomById(roomId: string): Promise<RoomEntity> {
    try {
      const room = await this.roomRepository.findOneBy({
        _id: new ObjectId(roomId),
      } as any);
      if (!room) throw new NotFoundException("There's no room");
      return room;
    } catch (error) {
      throw new BadRequestException('Failed to find room');
    }
  }

  async findUserRooms(userId: string): Promise<RoomEntity[]> {
    try {
      const rooms = await this.roomRepository.find({
        where: { participants: new ObjectId(userId) },
      } as any);
      if (!rooms) throw new NotFoundException("There're no user rooms");
      return rooms;
    } catch (error) {
      throw new BadRequestException('Failed to find user rooms');
    }
  }

  async findPrivateRoom(
    userId1: string,
    userId2: string,
  ): Promise<RoomEntity | null> {
    try {
      const allPrivateRooms = await this.roomRepository.find({
        where: { type: 'private' },
      } as any);

      const privateRoom = allPrivateRooms.find((room) => {
        const participantIds = room.participants.map((id) => id.toString());
        return (
          participantIds.includes(userId1) && participantIds.includes(userId2)
        );
      });

      return privateRoom || null;
    } catch (error) {
      throw new BadRequestException('Failed to find private room');
    }
  }

  async createMessage(
    roomId: string,
    senderId: string,
    senderName: string,
    content: string,
    type: string = 'text',
  ): Promise<MessageEntity> {
    try {
      const message = this.messageRepository.create({
        roomId: new ObjectId(roomId),
        senderId: new ObjectId(senderId),
        senderName,
        content,
        type,
        readBy: [new ObjectId(senderId)],
      });
      await this.messageRepository.save(message);
      return message;
    } catch (error) {
      throw new BadRequestException('Failed to create message');
    }
  }

  async findRoomMessage(
    roomId: string,
    limit: number = 50,
  ): Promise<MessageEntity[]> {
    try {
      const messages = await this.messageRepository.find({
        where: { roomId: new ObjectId(roomId) } as any,
        order: { createdAt: 'DESC' },
        take: limit,
      });

      return messages;
    } catch (error) {
      throw new BadRequestException('Failed to find room message');
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const message = await this.messageRepository.findOneBy({
        _id: new ObjectId(messageId),
      } as any);

      if (message && !message.readBy.some((id) => id.toString() === userId)) {
        message.readBy.push(new ObjectId(userId));
        await this.messageRepository.save(message);
      }
    } catch (error) {
      throw new BadRequestException('Failed to mark message as read');
    }
  }

  async markRoomMessagesAsRead(roomId: string, userId: string): Promise<void> {
    try {
      const messages = await this.messageRepository.find({
        where: { roomId: new ObjectId(roomId) } as any,
      });

      for (const message of messages) {
        if (!message.readBy.some((id) => id.toString() === userId))
          message.readBy.push(new ObjectId(userId));
      }

      await this.messageRepository.save(messages);
    } catch (error) {
      throw new BadRequestException('Failed to mark room message as read');
    }
  }
}
