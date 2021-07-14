import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from './entities';

export const createConfigFactory =
  (configName: string) => (configService: ConfigService) =>
    ({
      default: {
        type: 'postgres',
        host: configService.get('POSTGRESQL_HOST'),
        port: configService.get<number>('POSTGRESQL_PORT'),
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        database: configService.get('POSTGRESQL_DATABASE'),
        synchronize: false,
        logging: true,
        entities,
        migrations: ['migration/**/*.{js,ts}'],
        subscribers: ['subscribers/**/*.{js,ts}'],
        cli: {
          entitiesDir: 'entities',
          migrationsDir: 'migration',
          subscribersDir: 'subscribers',
        },
      },
      development: {
        type: 'postgres',
        host: configService.get('POSTGRESQL_HOST'),
        port: configService.get<number>('POSTGRESQL_PORT'),
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        database: configService.get('POSTGRESQL_DATABASE'),
        synchronize: true,
        logging: false,
        entities,
        migrations: ['migration/**/*.{js,ts}'],
        subscribers: ['subscribers/**/*.{js,ts}'],
        cli: {
          entitiesDir: 'entities',
          migrationsDir: 'migration',
          subscribersDir: 'subscribers',
        },
      },
      test: {
        type: 'postgres',
        host: configService.get('POSTGRESQL_HOST'),
        port: configService.get<number>('POSTGRESQL_PORT'),
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        database: configService.get('POSTGRESQL_DATABASE'),
        synchronize: true,
        logging: false,
        dropSchema: true,
        entities,
        migrations: ['migration/**/*.{js,ts}'],
        subscribers: ['subscribers/**/*.{js,ts}'],
        cli: {
          entitiesDir: 'entities',
          migrationsDir: 'migration',
          subscribersDir: 'subscribers',
        },
      },
    }[configName] as TypeOrmModuleOptions);
