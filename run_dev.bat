@echo off
echo Starting Campus Resource Hub...

:: Start Backend in a new minimized window
echo Starting Backend (FastAPI)...
start /min cmd /c "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

:: Start Frontend in the current window (or another one if preferred)
echo Starting Frontend (Next.js)...
cd frontend && npm run dev
