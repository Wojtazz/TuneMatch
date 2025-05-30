import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
