<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# SQLCoder LLM with NestJS & React Frontend

A full-stack application that uses Ollama with SQLCoder model to convert natural language to SQL queries. Features a modern React frontend built with shadcn/ui components and a NestJS backend.

## Architecture

- **Backend**: NestJS with TypeScript
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with PostGIS
- **AI Model**: Ollama with SQLCoder
- **Deployment**: Docker Compose

## Prerequisites

- Node.js (v18+)
- Yarn or npm
- PostgreSQL
- Ollama (with SQLCoder model)
- Docker & Docker Compose (for containerized deployment)

## Project Structure

```
sqlcoder-llm/
├── src/                    # NestJS backend source
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main application
│   ├── Dockerfile         # Frontend Docker configuration
│   └── nginx.conf         # Nginx configuration for production
├── db/                    # Database scripts and migrations
├── docker-compose.yml     # Multi-service Docker setup
└── Dockerfile            # Backend Docker configuration
```

## Development Setup

### Backend

1. Install dependencies:
```bash
yarn install
```

2. Create a `.env` file:
```env
# Database configuration
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=llm_demo
PG_HOST=localhost
PG_PORT=5432

# Ollama configuration
OLLAMA_HOST=http://localhost:11434
```

3. Start the backend:
```bash
yarn start:dev
```

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:3000`.

## Production Deployment

### Using Docker Compose

1. Start all services:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- NestJS backend on port 3000
- React frontend on port 3003

2. Access the application at `http://localhost:3003`

### Manual Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
yarn build
```

3. Deploy the built assets to your preferred hosting platform.

## Features

### Frontend
- 🎨 Modern UI with shadcn/ui components
- 🌙 Dark/light theme support
- 📱 Responsive design
- ⚡ Real-time SQL generation with streaming
- 🧪 Automated test runner interface
- 📊 Test case management and filtering
- 🔄 Live query results

### Backend
- 🚀 NestJS framework with TypeScript
- 🤖 Ollama integration for AI-powered SQL generation
- 🗄️ PostgreSQL with PostGIS support
- 🧪 Automated test runner for SQL validation
- 📡 RESTful API with streaming support
- 🔒 CORS configuration for frontend integration

## API Endpoints

- `POST /generate-sql` - Generate SQL from natural language
- `POST /generate-sql-stream` - Generate SQL with streaming response
- `POST /api/test-runner/run` - Run automated tests
- `GET /api/test-runner/test-cases` - Get all test cases

## Environment Variables

### Backend (.env)
```env
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=llm_demo
PG_HOST=localhost
PG_PORT=5432
OLLAMA_HOST=http://localhost:11434
PORT=3000
```

### Docker Compose (.env)
```env
PG_USER=postgres
PG_PASSWORD=postgres
PG_PORT=5432
```

## Development Commands

### Backend
```bash
yarn start:dev      # Start in development mode
yarn build          # Build for production
yarn start:prod     # Start in production mode
yarn test           # Run tests
yarn lint           # Run linter
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run linter
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
