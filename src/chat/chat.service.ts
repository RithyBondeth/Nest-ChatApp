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

      return message;
    } catch (error) {
      throw new BadRequestException('Failed to create message');
    }
  }
}
