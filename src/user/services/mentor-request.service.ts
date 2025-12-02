import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MentorRequestEntity } from '../entities/mentor-request.entity';
import { CreateMentorRequestDto } from '../dtos/mentor-request.dto';
import { UserService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { RequestStatus } from '../types/request-status.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class MentorRequestService {
  constructor(
    @InjectRepository(MentorRequestEntity)
    private readonly mentorRequestRepository: Repository<MentorRequestEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async findByMentee(mentee: UserEntity): Promise<MentorRequestEntity[]> {
    return this.mentorRequestRepository.find({
      where: { mentee: { userId: mentee.userId } },
      relations: ['mentee', 'mentor'],
    });
  }

  async findByMentor(mentor: UserEntity): Promise<MentorRequestEntity[]> {
    return this.mentorRequestRepository.find({
      where: { mentor: { userId: mentor.userId } },
      relations: ['mentee', 'mentor'],
    });
  }

  async create(
    mentee: UserEntity,
    createMentorRequestDto: CreateMentorRequestDto,
  ): Promise<MentorRequestEntity> {
    const mentor = await this.userService.findOne(
      createMentorRequestDto.mentorId,
    );

    if (!mentor) {
      throw ResponseException.userNotFound();
    }

    const existingRequest = await this.mentorRequestRepository.findOne({
      where: {
        mentee: { userId: mentee.userId },
        mentor: { userId: mentor.userId },
        status: RequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw ResponseException.mentorRequestAlreadyExists();
    }

    const request = this.mentorRequestRepository.create({
      mentee,
      mentor,
      status: RequestStatus.PENDING,
    });

    return this.mentorRequestRepository.save(request);
  }

  async updateStatus(
    mentor: UserEntity,
    requestId: number,
    status: RequestStatus.ACCEPTED | RequestStatus.REJECTED,
  ): Promise<MentorRequestEntity> {
    const mentorRequest = await this.mentorRequestRepository.findOne({
      where: { mentorRequestId: requestId },
      relations: ['mentee', 'mentor'],
    });

    if (!mentorRequest) {
      throw ResponseException.mentorRequestNotFound();
    }

    if (mentorRequest.mentor.userId !== mentor.userId) {
      throw ResponseException.forbidden();
    }

    if (mentorRequest.status !== RequestStatus.PENDING) {
      throw ResponseException.invalidMentorRequest();
    }

    mentorRequest.status = status;
    await this.mentorRequestRepository.save(mentorRequest);

    if (status === RequestStatus.ACCEPTED) {
      const mentee = await this.userService.findOne(
        mentorRequest.mentee.userId,
      );

      if (mentee) {
        await this.userService.update(mentee, {
          mentor: mentorRequest.mentor,
        });
      }
    }

    return mentorRequest;
  }

  async accept(
    mentor: UserEntity,
    requestId: number,
  ): Promise<MentorRequestEntity> {
    return this.updateStatus(mentor, requestId, RequestStatus.ACCEPTED);
  }

  async reject(
    mentor: UserEntity,
    requestId: number,
  ): Promise<MentorRequestEntity> {
    return this.updateStatus(mentor, requestId, RequestStatus.REJECTED);
  }
}
