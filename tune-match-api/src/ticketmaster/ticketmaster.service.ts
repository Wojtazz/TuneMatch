import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { staticConfig } from 'src/config/static-config';
import { Concert } from './ticketmaster.interface';

@Injectable()
export class TicketmasterService {
  async getConcertsByArtistName(
    name: string,
    countryCodes: string | string[],
  ): Promise<Concert[]> {
    const response = await axios.get(staticConfig.TICKETMASTER_EVENTS_URL, {
      params: {
        keyword: name,
        apikey: process.env.TICKETMASTER_API_KEY,
        startDateTime: new Date().toISOString().split('.')[0] + 'Z',
        segmentId: 'KZFzniwnSyZfZ7v7nJ',
        countryCode: Array.isArray(countryCodes)
          ? countryCodes.join(',')
          : countryCodes,
      },
    });

    if (response.data?._embedded?.events) {
      const concerts = response.data._embedded.events.map((concert) => {
        return {
          proposedBy: name,
          ticketMasterId: concert.id,
          name: concert.name,
          url: concert.url,
          date: {
            localDate: concert.dates.start.localDate,
            localTime: concert.dates.start.localTime,
            timezone: concert.dates?.timezone || null,
          },
          location: concert._embedded.venues.map((venue) => {
            return {
              place: venue.name,
              city: venue.city?.name || null,
              countryCode: venue.country?.countryCode || null,
              address: venue.address?.line1 || null,
            };
          }),
        };
      });

      return concerts;
    }

    return [];
  }
}
