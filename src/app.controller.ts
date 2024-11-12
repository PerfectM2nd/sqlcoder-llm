import { Controller, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-sql')
  async generateSql(
    @Body() body: { query: string; domain: string },
    @Res() res: Response,
  ) {
    try {
      const result = await this.appService.generateSql(body.query, body.domain);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  @Post('generate-sql-stream')
  async generateSqlStream(
    @Body() body: { query: string; domain: string },
    @Res() res: Response,
  ) {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await this.appService.generateSqlStream(
        body.query,
        body.domain,
      );

      stream.subscribe({
        next: (chunk) => {
          res.write(chunk);
        },
        error: (error) => {
          console.error('Stream error:', error);
          res.end();
        },
        complete: () => {
          res.end();
        },
      });
    } catch (e) {
      console.error('Error in generate-sql-stream:', e);
      res.status(500).json({ error: e.message });
    }
  }
}
