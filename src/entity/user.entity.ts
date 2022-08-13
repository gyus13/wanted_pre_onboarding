import {
    Entity,
    Column,
} from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('USER')
export class User extends CommonEntity{
}
