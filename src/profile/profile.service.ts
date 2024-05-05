import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { isExistsFile } from '@/utils/isExistsFIle';
import {
  AVATAR_NOT_FOUND,
  PROFILE_ALREADY_EXISTS,
  PROFILE_NOT_FOUND,
} from '@/constants/response-messages';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(userId: number) {
    const existingProfile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException(PROFILE_ALREADY_EXISTS);
    }

    return await this.profileRepository.save({ userId });
  }

  async getProfile(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: { user: true },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    return profile;
  }

  async update(dto: UpdateProfileDto, userId: number) {
    const profile = await this.profileRepository.findOne({ where: { userId } });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    if (!(await isExistsFile(dto.avatar))) {
      throw new NotFoundException(AVATAR_NOT_FOUND);
    }

    return await this.profileRepository.save({
      id: profile.id,
      ...dto,
    });
  }

  async delete(userId: number): Promise<void> {
    const deletedProfile = await this.profileRepository.delete({ userId });

    if (!deletedProfile) {
      throw new NotFoundException();
    }
  }
}