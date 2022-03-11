import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus() {
    return {
      status: 'Ok',
      version: this.configService.get<string>('APP_VERSION'),
    };
  }
}
