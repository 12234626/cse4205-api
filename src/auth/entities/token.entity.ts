import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '토큰 ID' })
  @PrimaryGeneratedColumn()
  tokenId: number;

  @ApiProperty({ description: '액세스 토큰' })
  @Column({ unique: true, length: 255 })
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰' })
  @Column({ unique: true, length: 255 })
  refreshToken: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '사용자', type: () => UserEntity })
  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
