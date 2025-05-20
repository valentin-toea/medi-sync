import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

export const setDatabase = (
  config: ConfigService,
): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions => {
  const type = config.get<string>('DB_TYPE', 'sqlite') as DatabaseType;
  // const synchronize = config.get<boolean>('DB_SYNCHRONIZE', false);
  const synchronize = true;

  if (type === 'postgres') {
    return {
      type,
      host: config.get<string>('DB_HOST'),
      port: config.get<number>('DB_PORT', 5432),
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_DATABASE'),
      synchronize,
      autoLoadEntities: true,
    };
  }
  return {
    type: 'sqlite',
    database: config.get<string>('DB_DATABASE', 'dev.sqlite'),
    synchronize,
    autoLoadEntities: true,
  };
};
