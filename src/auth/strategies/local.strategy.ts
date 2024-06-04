import { IUser } from '@/user/types/user.interface';
import { UserService } from '@/user/user.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
