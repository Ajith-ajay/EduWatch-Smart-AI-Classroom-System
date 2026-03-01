import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SubstitutionController } from './substitution.controller';
import { SubstitutionService } from './substitution.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SubstitutionController],
  providers: [SubstitutionService],
})
export class SubstitutionModule {}
