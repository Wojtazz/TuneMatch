import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { TicketmasterService } from 'src/ticketmaster/ticketmaster.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ticketmasterService: TicketmasterService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @Get()
  async test() {
    const users = await this.userModel.find().exec();
    await this.userService.matchUser(users[0]);
  }
}
