import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../schemas/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly hashDifficulty: number;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.hashDifficulty = configService.get('HASH_DIFFICULTY') || 12;
  }

  async createHash(password: string): Promise<string> {
    const hash = await bcrypt.hashSync(password, this.hashDifficulty);

    return hash;
  }

  async transformBody(dto: CreateUserDto): Promise<CreateUserDto> {
    const transformedDto: CreateUserDto = {
      login: dto.login,
      email: dto.email,
      password: '',
    };

    transformedDto.password = await this.createHash(dto.password);

    return transformedDto;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const transformedUser = await this.transformBody(dto);

    const newUser = this.userRepository.create(transformedUser);

    const createdUser = await this.userRepository.save(newUser);

    return createdUser;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const userFinded: User = await this.findOne(id);

    userFinded.login = dto?.login || userFinded.login;
    userFinded.email = dto?.email || userFinded.email;
    userFinded.password =
      (await this.createHash(dto.password)) || userFinded.password;

    return await this.userRepository.save(userFinded);
  }

  async findOne(id: number): Promise<User> {
    const userFinded = await this.userRepository.findOne(id);

    if (!userFinded) throw new NotFoundException(`User ${id} not found!`);

    return userFinded;
  }

  async delete(id: number) {
    await this.findOne(id);

    return await this.userRepository.delete(id);
  }
}
