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
    const users: User[] = await this.userModel.find().exec();

    for (const user of users) {
      const concerts = await this.userService.getConcertsForUser(user);

      if (concerts.length > 0) {
        await this.userService.updateUser(user._id as unknown as string, {
          $push: { proposedConcerts: { $each: concerts } },
        });
      }
    }
  }
}
