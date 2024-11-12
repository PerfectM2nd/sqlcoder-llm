import { Controller, Post, Get } from '@nestjs/common';
import { TestRunnerService } from './test-runner.service';

@Controller('api/test-runner')
export class TestRunnerController {
  constructor(private readonly service: TestRunnerService) {}

  /** POST /api/test-runner/run */
  @Post('run')
  async runAllTests() {
    return this.service.runAll();
  }

  /** GET /api/test-runner/test-cases */
  @Get('test-cases')
  async getAllTestCases() {
    return this.service.getAllTestCases();
  }
}
