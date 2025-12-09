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
import { TokenEntity } from 'src/auth/entities/token.entity';
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

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsUrl()
  @IsOptional()
  avatarUrl: string | null;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  exp: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  todayQuest: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  streak: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => TokenEntity, (token: TokenEntity) => token.user, {
    cascade: ['soft-remove'],
  })
  tokens: TokenEntity[];

  @ManyToOne(() => UserEntity, (user) => user.mentees)
  mentor: UserEntity | null;

  @OneToMany(() => UserEntity, (user) => user.mentor)
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
}
