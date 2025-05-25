devi: 
	docker compose up --build

init-test-cases:
	@echo "Checking if test cases need to be initialized..."
	@if [ "$$(psql -d llm_demo -t -c "SELECT COUNT(*) FROM test_cases;")" -eq "0" ]; then \
		echo "Initializing test cases..."; \
		psql -d llm_demo -f ./db/test-cases.sql; \
		echo "Test cases initialized."; \
	else \
		echo "Test cases already exist, skipping initialization."; \
	fi

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

start-ollama:
	@echo "Starting Ollama and pulling SQLCoder model..."
	@if ! pgrep -x "ollama" > /dev/null; then \
		ollama serve & \
		sleep 5; \
	fi
	@ollama pull sqlcoder:7b