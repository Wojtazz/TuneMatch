import { Module } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';
import { TicketmasterController } from './ticketmaster.controller';

@Module({
  providers: [TicketmasterService],
  controllers: [TicketmasterController],
  exports: [TicketmasterService],
})
export class TicketmasterModule {}
