import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  IsBoolean,
  Min,
} from 'class-validator';

import type { GuardianRelationshipEntity } from 'src/guardian/entities/guardian-relationship.entity';
import type { UserQuestEntity } from 'src/user-quest/entities/user-quest.entity';
import type { VerificationEntity } from 'src/verification/entities/verification.entity';
import type { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';

export enum Provider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
}

export enum UserRole {
  GUARDIAN = 'guardian',
  WARD = 'ward',
}

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Column({ type: 'enum', enum: Provider })
  @IsEnum(Provider)
  provider: Provider;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  providerId: string;

  @Column({ type: 'int', nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  age: number;

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
  avatarUrl: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isAdmin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  lastLoginAt: Date;

  @OneToMany(
    'GuardianRelationshipEntity',
    (relationship: GuardianRelationshipEntity) => relationship.guardian,
  )
  wards: GuardianRelationshipEntity[];

  @OneToMany(
    'GuardianRelationshipEntity',
    (relationship: GuardianRelationshipEntity) => relationship.ward,
  )
  guardians: GuardianRelationshipEntity[];

  @OneToMany('UserQuestEntity', (userQuest: UserQuestEntity) => userQuest.user)
  userQuests: UserQuestEntity[];

  @OneToMany(
    'VerificationEntity',
    (verification: VerificationEntity) => verification.reviewer,
  )
  verifications: VerificationEntity[];

  @OneToMany(
    'UserRewardEntity',
    (userReward: UserRewardEntity) => userReward.user,
  )
  userRewards: UserRewardEntity[];
}
