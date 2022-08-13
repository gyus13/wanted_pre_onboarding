import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('APPLY')
export class Apply extends CommonEntity {
  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  postId: number;
}
