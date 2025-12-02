import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';

import { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import { VerificationEntity } from 'src/verification/entities/verification.entity';
import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';

@Unique(['provider', 'providerId'])
@Unique(['username'])
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'enum', enum: Provider })
  @IsEnum(Provider)
  provider: Provider;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  providerId: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'varchar', length: 15 })
  @IsString()
  username: string;

  @Column({ type: 'int', nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @Column({ type: 'int', default: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  exp: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  streak: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.mentees, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  mentor?: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.mentor, {
    cascade: ['soft-remove'],
  })
  mentees: UserEntity[];

  @OneToMany(
    () => UserQuestEntity,
    (userQuest: UserQuestEntity) => userQuest.user,
    { cascade: ['soft-remove'] },
  )
  userQuests: UserQuestEntity[];

  @OneToMany(
    () => UserRewardEntity,
    (userReward: UserRewardEntity) => userReward.user,
    { cascade: ['soft-remove'] },
  )
  userRewards: UserRewardEntity[];

  @OneToMany(
    () => VerificationEntity,
    (verification: VerificationEntity) => verification.reviewer,
    { cascade: ['soft-remove'] },
  )
  verifications: VerificationEntity[];
}
