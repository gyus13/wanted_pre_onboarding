import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('POST')
export class Post extends CommonEntity {
  @ApiProperty()
  @Column()
  position: string;

  @ApiProperty()
  @Column()
  reward: string;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty()
  @Column()
  tech: string;

  @ApiProperty()
  @Column()
  companyId: number;
}
