import { Column, Entity, Index, ObjectId, ObjectIdColumn } from "typeorm";
import { TChatStatus } from "@app/common/database/types/status.type";

@Entity('user')
export class UserEntity {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    @Index({ unique: true })
    username: string

    @Column()
    @Index({ unique: true })
    email: string

    @Column() 
    password: string

    @Column({ default: TChatStatus.ONLINE })
    status: TChatStatus

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastSeen: Date
}