@echo off
title GameArchive Starter
echo Starting GameArchive...

:: 获取本机 IP 地址用于分享建议
for /f "tokens=4" %%a in ('route print ^| find " 0.0.0.0"') do set IP=%%a

echo.
echo ==========================================
echo   GAME ARCHIVE 启动程序
echo ==========================================
echo.
echo [1] 正在开启后端服务窗口 (Server)...
start "GameArchive Backend" cmd /k "python server.py"

echo [2] 正在开启前端界面窗口 (Frontend)...
cd frontend
start "GameArchive Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo 启动指令已发送！
echo 请查看弹出的两个新窗口是否有报错信息。
echo.
echo 如果一切正常，请访问:
echo 本地: http://localhost:5173
echo 局域网: http://%IP%:5173
echo ==========================================
pause
