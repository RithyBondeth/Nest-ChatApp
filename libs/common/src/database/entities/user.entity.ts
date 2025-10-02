import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { TChatStatus } from '@app/common/database/enums/status.type';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ default: TChatStatus.ONLINE })
  status: TChatStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;
}
