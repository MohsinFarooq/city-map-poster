.PHONY: redis celery api frontend dev

redis:
	brew services start redis

celery:
	cd backend && celery -A app.core.celery_app worker --loglevel=info --pool=solo

api:
	cd backend && uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

dev:
	@echo "Start redis, then run 'make api', 'make celery', 'make frontend' in separate terminals"