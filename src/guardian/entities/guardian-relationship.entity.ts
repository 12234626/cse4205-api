import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { IsString } from 'class-validator';

import type { UserEntity } from 'src/user/entities/user.entity';

@Entity('guardian_relationship')
export class GuardianRelationshipEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  guardianId: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  @IsString()
  wardId: string;

  @ManyToOne('UserEntity', (user: UserEntity) => user.wards)
  @JoinColumn({ name: 'guardian_id' })
  guardian: UserEntity;

  @ManyToOne('UserEntity', (user: UserEntity) => user.guardians)
  @JoinColumn({ name: 'ward_id' })
  ward: UserEntity;
}
