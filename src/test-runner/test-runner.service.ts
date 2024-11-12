import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TestCase } from '../entities/test-case.entity';
import { TestResult } from '../entities/test-result.entity';
import { AppService } from '../app.service';

@Injectable()
export class TestRunnerService {
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepo: Repository<TestCase>,
    @InjectRepository(TestResult)
    private readonly testResultRepo: Repository<TestResult>,
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  async getAllTestCases() {
    return this.testCaseRepo.find({
      order: { domain: 'ASC', id: 'ASC' },
    });
  }

  async runAll(): Promise<{ total: number; passed: number; results: any[] }> {
    const testCases = await this.testCaseRepo.find();
    const report: any[] = [];
    let passed = 0;

    for (const tc of testCases) {
      const start = Date.now();
      let generatedSql = '';
      try {
        const resp = await this.appService.generateSql(
          tc.naturalLanguage,
          tc.domain,
        );
        generatedSql = resp.sql?.trim() ?? '';
      } catch (e) {
        console.error('Error in generateSql:', e);
        generatedSql = '';
      }
      const genTime = Date.now() - start;

      // выполнение sql
      const exec = async (sql: string) => {
        try {
          return await this.dataSource.query(sql);
        } catch (e) {
          return e; // вернём объект ошибки
        }
      };
      const refRows = await exec(tc.referenceSql);
      const genRows = generatedSql
        ? await exec(generatedSql)
        : new Error('no SQL');

      // метрики
      const isSqlCorrect = generatedSql === tc.referenceSql.trim();
      const isResultMatch =
        !(refRows instanceof Error) &&
        !(genRows instanceof Error) &&
        JSON.stringify(refRows) === JSON.stringify(genRows);

      if (isResultMatch) passed++;

      // сохранить результат в БД
      await this.testResultRepo.save({
        test: tc,
        generatedSql,
        isSqlCorrect,
        isResultMatch,
        generationTimeMs: genTime,
      });

      // для фронтенда
      report.push({
        testId: tc.id,
        question: tc.naturalLanguage,
        generatedSql,
        isSqlCorrect,
        isResultMatch,
        generationTimeMs: genTime,
      });
    }

    return { total: testCases.length, passed, results: report };
  }
}
