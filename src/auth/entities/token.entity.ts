import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn()
  tokenId: number;

  @Column({ unique: true, length: 255 })
  accessToken: string;

  @Column({ unique: true, length: 255 })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
