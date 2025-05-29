import { Controller, Get } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';

@Controller('ticketmaster')
export class TicketmasterController {
  constructor(private readonly ticketmasterService: TicketmasterService) {}

  @Get()
  async fetchConcerts() {
    return this.ticketmasterService.getConcertsByArtistName('Bladee');
  }
}
