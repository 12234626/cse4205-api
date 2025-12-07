import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from './user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { MentorRequestEntity } from 'src/user/entities/mentor-request.entity';
import { RequestStatus } from 'src/user/types/request-status.type';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { UserRole } from '../types/user-role.type';

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
      where: { mentee },
      relations: ['mentor', 'mentee'],
    });
  }

  async findByMentor(mentor: UserEntity): Promise<MentorRequestEntity[]> {
    return this.mentorRequestRepository.find({
      where: { mentor },
      relations: ['mentor', 'mentee'],
    });
  }

  async create(
    userRole: UserRole,
    user: UserEntity,
    username: string,
  ): Promise<MentorRequestEntity> {
    let mentor: UserEntity | null;
    let mentee: UserEntity | null;

    if (user.role !== userRole) {
      throw ResponseException.invalidUserRole();
    }

    if (userRole === UserRole.MENTEE) {
      mentor = await this.userService.findByUsername(username);
      mentee = user;
    } else {
      mentor = user;
      mentee = await this.userService.findByUsername(username);
    }

    if (!mentor || !mentee) {
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

    const mentorRequest = this.mentorRequestRepository.create({
      mentee,
      mentor,
      status: RequestStatus.PENDING,
    });

    return this.mentorRequestRepository.save(mentorRequest);
  }

  async updateStatus(
    userRole: UserRole,
    user: UserEntity,
    mentorRequestId: number,
    status: RequestStatus.ACCEPTED | RequestStatus.REJECTED,
  ): Promise<MentorRequestEntity> {
    const mentorRequest = await this.mentorRequestRepository.findOne({
      where: { mentorRequestId },
      relations: ['mentor', 'mentee'],
    });

    if (!mentorRequest) {
      throw ResponseException.mentorRequestNotFound();
    }

    const mentor = mentorRequest.mentor;
    const mentee = mentorRequest.mentee;

    if (user.role !== userRole) {
      throw ResponseException.invalidUserRole();
    }

    if (userRole === UserRole.MENTOR) {
      if (mentor.userId !== user.userId) {
        throw ResponseException.forbidden();
      }
    } else if (userRole === UserRole.MENTEE) {
      if (mentee.userId !== user.userId) {
        throw ResponseException.forbidden();
      }
    }

    if (mentorRequest.status !== RequestStatus.PENDING) {
      throw ResponseException.invalidMentorRequest();
    }

    mentorRequest.status = status;

    if (status === RequestStatus.ACCEPTED) {
      await this.userService.update(mentee, { mentor });

      const pendingMentorRequests = await this.mentorRequestRepository.find({
        where: {
          mentee,
          status: RequestStatus.PENDING,
        },
      });

      await Promise.all(
        pendingMentorRequests.map(async (request) => {
          if (request.mentorRequestId !== mentorRequestId) {
            request.status = RequestStatus.REJECTED;
            await this.mentorRequestRepository.save(request);
          }
        }),
      );
    }

    return this.mentorRequestRepository.save(mentorRequest);
  }

  async accept(
    userRole: UserRole,
    user: UserEntity,
    mentorRequestId: number,
  ): Promise<MentorRequestEntity> {
    return this.updateStatus(
      userRole,
      user,
      mentorRequestId,
      RequestStatus.ACCEPTED,
    );
  }

  async reject(
    userRole: UserRole,
    user: UserEntity,
    mentorRequestId: number,
  ): Promise<MentorRequestEntity> {
    return this.updateStatus(
      userRole,
      user,
      mentorRequestId,
      RequestStatus.REJECTED,
    );
  }
}
