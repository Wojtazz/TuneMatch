import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SharedService {
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getNeighboringCountryCodes(alpha2Code: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/alpha/${alpha2Code}`,
      );
      const borders = response.data?.[0]?.borders || [];

      if (!borders.length) return [];

      const conversionResponse = await axios.get(
        `https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`,
      );
      const alpha2Codes = conversionResponse.data.map(
        (country) => country.cca2,
      );

      return alpha2Codes;
    } catch (error) {
      console.error(
        `Error fetching neighboring countries for ${alpha2Code}`,
        error,
      );
      return [];
    }
  }
}
