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

  constructor(userOtgCode?: Partial<UserOtgCode>) {
    this.id = userOtgCode?.id;
    this.email = userOtgCode?.email;
    this.user = userOtgCode?.user;
    this.otgCode = userOtgCode?.otgCode || Math.random().toString().slice(-6);
    this.created_at = userOtgCode?.created_at || new Date();
    this.updated_at = userOtgCode?.updated_at || new Date();
  }
}
