import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity('room')
export class RoomEntity {
    @ObjectIdColumn()
    id: ObjectId 

    @Column()
    name: string

    @Column()
    type: string    

    @Column('array') 
    participants: ObjectId[]

    @Column({ nullable: true })
    createdBy: ObjectId

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}