import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from '../entities/test-case.entity';
import { TestResult } from '../entities/test-result.entity';
import { TestRunnerService } from './test-runner.service';
import { TestRunnerController } from './test-runner.controller';
import { AppService } from '../app.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase, TestResult])],
  providers: [TestRunnerService, AppService],
  controllers: [TestRunnerController],
})
export class TestRunnerModule {}
