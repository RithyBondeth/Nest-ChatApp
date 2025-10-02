import { Column, Entity, Index, ObjectId, ObjectIdColumn } from "typeorm";

@Entity('message')
export class MessageEntity {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    @Index()
    roomId: ObjectId

    @Column()
    @Index()
    senderId: ObjectId;

    @Column()
    senderName: string;

    @Column()
    content: string;

    @Column({ default: 'text' })
    type: string; // text, image, file

    @Column({ default: false })
    isRead: boolean;

    @Column('array')
    readBy: ObjectId[]; // Array of user IDs who read the message

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}