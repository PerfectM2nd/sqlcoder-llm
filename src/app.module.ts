import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from './entities/test-case.entity';
import { TestResult } from './entities/test-result.entity';
import { TestRunnerModule } from './test-runner/test-runner.module';

@Module({
  imports: [
    // статические файлы
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/generate-sql*', '/api*'],
    }),

    // Подключение TypeORM (PostgreSQL 17)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST ?? 'localhost',
      port: +(process.env.PG_PORT ?? 5432),
      username: process.env.PG_USER ?? 'postgres',
      password: process.env.PG_PASSWORD ?? 'postgres',
      database: process.env.PG_DB ?? 'llm_demo',
      entities: [TestCase, TestResult],
      synchronize: true, // для dev-режима; в prod заменить на миграции
    }),
    TestRunnerModule, // <-- новый модуль
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
