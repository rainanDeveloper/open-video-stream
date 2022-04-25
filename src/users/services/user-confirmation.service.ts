import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOtgCode } from '../schemas/user-otg-code.entity';
import { CreateUserOtgCodeDto } from '../dto/create-user-otg-code.dto';

@Injectable()
export class UserConfirmationService {
  constructor(
    @InjectRepository(UserOtgCode)
    private readonly userOtgCodeRepository: Repository<UserOtgCode>,
  ) {}

  async create(createDto: CreateUserOtgCodeDto): Promise<UserOtgCode> {
    const newUser = this.userOtgCodeRepository.create(createDto);

    return await this.userOtgCodeRepository.save(newUser);
  }

  async updateOtgCode(email: string): Promise<UserOtgCode> {
    const otgCodeToUpdate = await this.findOneByEmail(email);

    otgCodeToUpdate.otgCode = Math.random().toString().slice(-6);
    otgCodeToUpdate.updated_at = new Date();

    return await this.userOtgCodeRepository.save(otgCodeToUpdate);
  }

  async findOneByEmail(email: string): Promise<UserOtgCode> {
    const otgCode = await this.userOtgCodeRepository.findOne(
      { email },
      { relations: ['user'] },
    );

    if (!otgCode)
      throw new NotFoundException(`Otg Code for email ${email} not found!`);

    return otgCode;
  }

  async delete(email: string) {
    await this.findOneByEmail(email);

    return await this.userOtgCodeRepository.delete({ email });
  }
}
