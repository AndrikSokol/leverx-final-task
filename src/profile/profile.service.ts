import {
  BadRequestException,
  Inject,
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
import { UserService } from '@/user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject('USER_SERVICE')
    private readonly userService: UserService,
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
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: { user: true },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    if (!(await isExistsFile(dto.avatar))) {
      throw new NotFoundException(AVATAR_NOT_FOUND);
    }

    await this.userService.save({
      id: userId,
      ...profile.user,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    await this.profileRepository.update(
      { id: profile.id },
      { avatar: dto.avatar, birthdate: dto.birthdate },
    );

    return await this.profileRepository.findOneBy({ id: profile.id });
  }

  async delete(userId: number): Promise<void> {
    const deletedProfile = await this.profileRepository.delete({ userId });

    if (!deletedProfile) {
      throw new NotFoundException();
    }
  }
}
