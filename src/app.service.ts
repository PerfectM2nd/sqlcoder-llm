import { Injectable } from '@nestjs/common';
import { GenerateRequest, Ollama } from 'ollama';
import * as fs from 'fs';
import * as path from 'path';
import { from, Observable } from 'rxjs';

@Injectable()
export class AppService {
  private readonly ollama: Ollama;
  private readonly schemaCache: Record<string, string> = {};

  constructor() {
    this.ollama = new Ollama({ host: 'http://localhost:11434' });
    // Preload schemas
    this.loadSchemas();
  }

  private loadSchemas() {
    const dbDir = path.join(process.cwd(), 'db');

    // Map domain names to their respective schema files
    const schemaFiles = {
      video: '01_video.sql',
      messenger: '02_messenger.sql',
      delivery: '03_delivery.sql',
    };

    // Load each schema into cache
    Object.entries(schemaFiles).forEach(([domain, filename]) => {
      try {
        const schemaPath = path.join(dbDir, filename);
        const schema = fs.readFileSync(schemaPath, 'utf8');
        this.schemaCache[domain] = schema;
      } catch (error) {
        console.error(`Error loading schema for ${domain}:`, error);
        this.schemaCache[domain] = 'Schema not available';
      }
    });
  }

  getPrompt(domain: string, nl: string): string {
    const schema = this.schemaCache[domain] || 'Schema not available';
    return `### Instructions:
Your task is to convert a question into a SQL query, given a Postgres database schema.
Adhere to these rules:
- **Deliberately go through the question and database schema word by word** to appropriately answer the question
- **Use Table Aliases** to prevent ambiguity. For example, \`SELECT table1.col1, table2.col1 FROM table1 JOIN table2 ON table1.id = table2.id\`.
- When creating a ratio, always cast the numerator as float

### Input:
Generate a SQL query that answers the question \`{${nl}}\`.
This query will run on a database whose schema is represented in this string:
${schema}

### Response:
Based on your instructions, here is the SQL query I have generated to answer the question \`{${nl}}\`:
\`\`\`sql
`;
  }

  getOllamaRequest(domain: string, query: string): GenerateRequest {
    return {
      model: 'sqlcoder:7b',
      prompt: this.getPrompt(domain, query),
    };
  }

  async generateSql(query: string, domain: string): Promise<{ sql: string }> {
    const prompt = this.getPrompt(domain, query);

    try {
      console.log('Generating SQL...');
      const response = await this.ollama.generate({
        model: 'sqlcoder:7b',
        prompt,
        stream: false,
      });
      console.log(response);
      return { sql: response.response };
    } catch (error) {
      console.error('Error generating SQL:', error);
      throw new Error('Failed to generate SQL: ' + error.message);
    }
  }

  async generateSqlStream(
    query: string,
    domain: string,
  ): Promise<Observable<string>> {
    return from(
      generateChunks(this.ollama, this.getOllamaRequest(domain, query)),
    );
  }
}

async function* generateChunks(ollama: Ollama, request: GenerateRequest) {
  const stream = await ollama.generate({
    ...request,
    stream: true,
  });

  for await (const chunk of stream) {
    yield JSON.stringify({ response: chunk.response, done: chunk.done });
  }
}
