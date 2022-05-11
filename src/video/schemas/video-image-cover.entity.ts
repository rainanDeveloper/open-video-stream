import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VideoImageCover {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  filename: string;

  @Column({ nullable: false })
  filesize_in_bytes: number;

  @Column({ nullable: false })
  filehash: string;
}
