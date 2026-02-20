@echo off
echo Starting Backend...
start cmd /k "cd /d C:\Users\User\Documents\trip-ideas-vue\backend && node index.js"

echo Starting Vite...
start cmd /k "cd /d C:\Users\User\Documents\trip-ideas-vue && npm run dev"

echo Both servers started!
pause