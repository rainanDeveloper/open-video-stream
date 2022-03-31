import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config: any = {
          type: 'mysql',
          host: configService.get('DATABASE_HOST') || 'localhost',
          port: configService.get('DATABASE_PORT') || '3306',
          username: configService.get('DATABASE_USERNAME') || 'root',
          password: configService.get('DATABASE_PASSWORD') || 'root',
          database: configService.get('DATABASE_NAME') || 'task_manager',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };

        return config;
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
