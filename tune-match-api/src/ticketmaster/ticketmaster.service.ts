import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { staticConfig } from 'src/config/static-config';

@Injectable()
export class TicketmasterService {
  async getConcertsByArtistName(name: string) {
    const response = await axios.get(staticConfig.TICKETMASTER_EVENTS_URL, {
      params: {
        keyword: name,
        apikey: process.env.TICKETMASTER_API_KEY,
        startDateTime: new Date().toISOString().split('.')[0] + 'Z',
      },
    });

    const concerts = response.data._embedded.events.map((concert) => {
      return {
        ticketMasterId: concert.id,
        name: concert.name,
        url: concert.url,
        date: {
          localDate: concert.dates.start.localDate,
          localTime: concert.dates.start.localTime,
          timezone: concert.dates.start.timezone,
        },
        location: concert._embedded.venues.map((venue) => {
          return {
            place: venue.name,
            city: venue.city.name,
            countryCode: venue.country.countryCode,
            address: venue.address.line1,
          };
        }),
      };
    });

    return concerts;
  }
}
