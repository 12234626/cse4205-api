import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VerificationEntity } from './entities/verification.entity';
import {
  CreateVerificationDto,
  UpdateVerificationDto,
} from './dtos/verification.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationEntity)
    private readonly verificationRepository: Repository<VerificationEntity>,
  ) {}

  async findAll(): Promise<VerificationEntity[]> {
    return this.verificationRepository.find();
  }

  async findOne(id: number): Promise<VerificationEntity | null> {
    const verification = await this.verificationRepository.findOne({
      where: { verificationId: id },
    });

    return verification;
  }

  async create(
    createVerificationDto: CreateVerificationDto,
  ): Promise<VerificationEntity> {
    const verification = this.verificationRepository.create(
      createVerificationDto,
    );

    return this.verificationRepository.save(verification);
  }

  async update(
    id: number,
    updateVerificationDto: UpdateVerificationDto,
  ): Promise<VerificationEntity> {
    const verification = await this.findOne(id);

    if (!verification) {
      throw ResponseException.verificationNotFound();
    }

    Object.assign(verification, updateVerificationDto);

    return this.verificationRepository.save(verification);
  }

  async softDelete(id: number): Promise<void> {
    await this.verificationRepository.softDelete(id);
  }
}
