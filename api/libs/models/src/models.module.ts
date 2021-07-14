import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createConfigFactory } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createConfigFactory(
        !process.env.NODE_ENV || process.env.NODE_ENV === 'production'
          ? 'default'
          : process.env.NODE_ENV,
      ),
    }),
  ],
})
export class ModelsModule {}
