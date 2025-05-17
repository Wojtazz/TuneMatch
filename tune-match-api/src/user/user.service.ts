import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(userData: UserDto): Promise<User> {
    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }
  test() {
    console.log('test');
  }
}
