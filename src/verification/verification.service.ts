import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VerificationEntity } from 'src/verification/entities/verification.entity';
import {
  CreateVerificationDto,
  UpdateVerificationDto,
} from 'src/verification/dtos/verification.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { ErrorCode } from 'src/common/types/error-code.type';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationEntity)
    private readonly verificationRepository: Repository<VerificationEntity>,
  ) {}

  async findAll(): Promise<VerificationEntity[]> {
    return this.verificationRepository.find({
      order: { verificationId: 'DESC' },
    });
  }

  async findOne(id: number): Promise<VerificationEntity> {
    const verification = await this.verificationRepository.findOne({
      where: { verificationId: id },
    });

    if (!verification) {
      throw new ResponseException(
        ErrorCode.NOT_FOUND,
        'Verification not found',
      );
    }

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
    Object.assign(verification, updateVerificationDto);
    return this.verificationRepository.save(verification);
  }

  async remove(id: number): Promise<void> {
    const verification = await this.findOne(id);
    await this.verificationRepository.remove(verification);
  }
}
