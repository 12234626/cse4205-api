import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MentorRequestService } from './mentor-request.service';
import { UserEntity } from '../entities/user.entity';
import { Provider } from '../types/provider.type';
import { UserRole } from '../types/user-role.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mentorRequestService: MentorRequestService,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    return user;
  }

  async findByProviderId(
    provider: Provider,
    providerId: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { provider, providerId },
    });

    return user;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    return user;
  }

  async findMentor(user: UserEntity): Promise<UserEntity | null> {
    const userWithMentor = await this.userRepository.findOne({
      where: { userId: user.userId },
      relations: ['mentor'],
    });

    return userWithMentor?.mentor || null;
  }

  async findMentees(user: UserEntity): Promise<UserEntity[]> {
    const mentees = await this.userRepository.find({
      where: { mentor: { userId: user.userId } },
    });

    return mentees;
  }

  async create(
    provider: Provider,
    providerId: string,
    username: string,
    role: UserRole,
    mentorUsername?: string,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      provider,
      providerId,
      username,
      role,
    });

    if (mentorUsername) {
      const mentor = await this.findByUsername(mentorUsername);

      if (mentor) {
        await this.mentorRequestService.create(user, {
          mentorId: mentor.userId,
        });
      }
    }

    return this.userRepository.save(user);
  }

  async update(
    user: UserEntity,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    Object.assign(user, data);

    return this.userRepository.save(user);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async removeMentor(user: UserEntity): Promise<void> {
    if (!user.mentor) {
      throw ResponseException.userNotFound();
    }

    user.mentor = null;
    await this.userRepository.save(user);
  }

  async removeMentees(mentor: UserEntity): Promise<void> {
    const mentees = await this.findMentees(mentor);

    for (const mentee of mentees) {
      mentee.mentor = null;
      await this.userRepository.save(mentee);
    }
  }

  async removeMentee(mentor: UserEntity, menteeId: number): Promise<void> {
    const mentee = await this.userRepository.findOne({
      where: { userId: menteeId },
      relations: ['mentor'],
    });

    if (!mentee || !mentee.mentor) {
      throw ResponseException.userNotFound();
    }

    if (mentee.mentor.userId !== mentor.userId) {
      throw ResponseException.forbidden();
    }

    mentee.mentor = null;
    await this.userRepository.save(mentee);
  }

  async softRemove(user: UserEntity): Promise<void> {
    await this.userRepository.softRemove(user);
  }
}
