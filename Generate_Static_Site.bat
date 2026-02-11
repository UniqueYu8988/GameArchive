@echo off
chcp 65001 > nul
title GameArchive 静态网站生成器 (For Netlify)

echo ========================================================
echo   正在为您准备 Netlify Drop 所需的静态文件
echo ========================================================
echo.

echo [1/3] 正在扫描图片并生成 Snapshot...
python static_export.py
if %errorlevel% neq 0 (
    echo [错误] 静态导出失败！
    pause
    exit
)

echo.
echo [2/3] 正在构建网页前端...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 前端构建失败！
    pause
    exit
)
cd ..

echo.
echo [3/3] 准备完成！
echo.
echo ========================================================
echo   🎉 成功生成 "dist" 文件夹！
echo   文件路径: %~dp0frontend\dist
echo.
echo   下一步操作:
echo   1. 打开 Netlify Drop 网站 (https://app.netlify.com/drop)
echo   2. 将自动弹出的 dist 文件夹直接拖拽到那个网页里
echo   3. 等待上传完成，您就拥有永久的个人网址了！
echo ========================================================
echo.

:: 自动打开 dist 文件夹
explorer "%~dp0frontend\dist"
pause
