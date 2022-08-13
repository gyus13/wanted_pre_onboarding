import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('COMPANY')
export class Company extends CommonEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  country: string;

  @ApiProperty()
  @Column()
  region: string;
}
