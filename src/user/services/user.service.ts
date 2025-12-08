import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { MentorRequestService } from './mentor-request.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mentorRequestService: MentorRequestService,
  ) {}

  async findAll(options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepository.find(options);
  }

  async findOne(
    option: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne(option);

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
      await this.mentorRequestService.create(user, mentorUsername);
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
    const userWithMentor = await this.userRepository.findOne({
      where: { userId: user.userId },
      relations: ['mentor'],
    });

    if (!userWithMentor || !userWithMentor.mentor) {
      throw ResponseException.userNotFound();
    }

    userWithMentor.mentor = null;
    await this.userRepository.save(userWithMentor);
  }

  async removeMentees(mentor: UserEntity): Promise<void> {
    const mentees = await this.findAll({
      where: { mentor: { userId: mentor.userId } },
      relations: ['mentor'],
    });

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
    const mentees = await this.findAll({
      where: { mentor: { userId: user.userId } },
      relations: ['mentor'],
    });

    await Promise.all(
      mentees.map(async (mentee) => {
        mentee.mentor = null;
        await this.userRepository.save(mentee);
      }),
    );

    await this.userRepository.softRemove(user);
  }
}
