import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { TicketmasterService } from 'src/ticketmaster/ticketmaster.service';
import { Concert } from 'src/ticketmaster/ticketmaster.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ticketmasterService: TicketmasterService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @Get('/match/:id')
  async matchUser(@Param('id') id: string): Promise<void> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.userService.matchUser(user);
  }

  @Get('/update-user-concerts/:id')
  async updateUserConcerts(@Param('id') id: string): Promise<Concert[]> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const concerts = await this.userService.getConcertsForUser(user);
    if (concerts.length > 0) {
      await this.userService.updateUser(user._id as unknown as string, {
        $push: { proposedConcerts: { $each: concerts } },
      });
    }

    return concerts;
  }
}
