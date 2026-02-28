import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TeachersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
