import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [UserModule, SpotifyModule],
  providers: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
