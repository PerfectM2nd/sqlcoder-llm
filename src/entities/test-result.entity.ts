import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TestCase } from './test-case.entity';

@Entity({ name: 'test_results' })
export class TestResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TestCase, { eager: true })
  @JoinColumn({ name: 'test_id' })
  test: TestCase;

  @Column({ type: 'text', name: 'generated_sql', nullable: true })
  generatedSql: string | null;

  @Column({ name: 'is_sql_correct', default: false })
  isSqlCorrect: boolean;

  @Column({ name: 'is_result_match', default: false })
  isResultMatch: boolean;

  @Column({ name: 'generation_time_ms', type: 'integer', nullable: true })
  generationTimeMs: number | null;

  @CreateDateColumn({ name: 'executed_at' })
  executedAt: Date;
}
