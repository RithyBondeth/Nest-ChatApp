import { Column, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    name: string

    @Column()
    email: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}