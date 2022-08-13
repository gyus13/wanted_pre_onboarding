import { Module } from '@nestjs/common';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { User } from '../entity/user.entity';
import { Company } from '../entity/company.entity';
import { Apply } from '../entity/apply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Company, Apply])],
  controllers: [RecruitController],
  providers: [RecruitService],
})
export class RecruitModule {}
