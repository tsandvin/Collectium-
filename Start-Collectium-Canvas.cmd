@echo off
setlocal
cd /d "%~dp0"
title Collectium Developer Builder v1.5
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm was not found. Install Node.js LTS first.
  pause
  exit /b 1
)
if exist .next (
  echo Clearing old Next.js cache...
  rmdir /s /q .next
)
if not exist node_modules (
  echo Installing dependencies...
  call npm.cmd install
)
start "" http://localhost:3000
call npm.cmd run dev
endlocal
