import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'test_cases' })
export class TestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  domain: string;

  @Column({ type: 'text', name: 'natural_language' })
  naturalLanguage: string;

  @Column({ type: 'text', name: 'reference_sql' })
  referenceSql: string;
}
