import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @Get('test')
  async test() {
    const users: User[] = await this.userModel.find().exec();

    users.forEach((user) => {
      this.userService.refreshAccessToken(user);
    });
  }
}
