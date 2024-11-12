# Makefile for SQLCoder LLM with NestJS

.PHONY: setup install start-db start-ollama start-app stop-db clean all start-docker stop-docker start-all init-test-cases

# Default target
all: setup start-app

# Setup environment
setup: install

# Install dependencies
install:
	@echo "Installing dependencies..."
	yarn install

# Initialize test cases
init-test-cases:
	@echo "Checking if test cases need to be initialized..."
	@if [ "$$(psql -d llm_demo -t -c "SELECT COUNT(*) FROM test_cases;")" -eq "0" ]; then \
		echo "Initializing test cases..."; \
		psql -d llm_demo -f ./db/test-cases.sql; \
		echo "Test cases initialized."; \
	else \
		echo "Test cases already exist, skipping initialization."; \
	fi

# Start PostgreSQL database
start-db:
	@echo "Starting PostgreSQL database..."
	@if [ -z "$$(psql -l | grep llm_demo)" ]; then \
		createdb llm_demo; \
		echo "Created database llm_demo"; \
		for f in ./db/*.sql; do \
			[ "$$f" != "./db/test-cases.sql" ] && echo "Loading $$f" && psql -d llm_demo -f $$f; \
		done; \
		$(MAKE) init-test-cases; \
	else \
		echo "Database llm_demo already exists"; \
		$(MAKE) init-test-cases; \
	fi

# Start Ollama with SQLCoder model
start-ollama:
	@echo "Starting Ollama and pulling SQLCoder model..."
	@if ! pgrep -x "ollama" > /dev/null; then \
		ollama serve & \
		sleep 5; \
	fi
	@ollama pull sqlcoder:7b

# Start Docker containers with Docker Compose
start-docker:
	@echo "Starting services with Docker Compose..."
	docker-compose up -d

# Stop Docker containers
stop-docker:
	@echo "Stopping Docker containers..."
	docker-compose down

# Start the application locally
start: start-db start-ollama
	@echo "Starting NestJS application..."
	yarn start:dev

# Start everything (Ollama on host, DB and app in Docker)
start-all: start-ollama start-docker
	@echo "All services started!"
	@echo "Ollama running on host, Database and app running in Docker"
	@echo "The application should be available at http://localhost:3000"

# Stop database
stop-db:
	@echo "Stopping PostgreSQL database..."
	@pg_ctl stop -D $$(pg_config --datadir) || true

# Clean environment
clean: stop-db stop-docker
	@echo "Cleaning environment..."
	@rm -rf dist
	@echo "Environment cleaned" 