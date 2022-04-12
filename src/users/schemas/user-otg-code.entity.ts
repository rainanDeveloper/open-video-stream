import { IsEmail } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserOtgCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  otgCode: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
