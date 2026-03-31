import { Module, Global } from '@nestjs/common';
import { ThrottleGuard } from '../guards/throttle.guard';

@Global()
@Module({
  providers: [ThrottleGuard],
  exports: [ThrottleGuard],
})
export class ThrottleModule {
  constructor(private throttleGuard: ThrottleGuard) {
    // Cleanup expired entries every 5 minutes
    setInterval(() => {
      this.throttleGuard.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }
}
