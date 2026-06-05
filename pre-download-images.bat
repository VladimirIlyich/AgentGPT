@echo off
chcp 65001 >nul
setlocal

set MIRROR=docker.m.daocloud.io/library

echo ========================================
echo AgentGPT - 预先下载 Docker 镜像（国内镜像源）
echo ========================================
echo.
echo 镜像源: %MIRROR%
echo.

docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop 未运行！
    echo 请先启动 Docker Desktop，然后重新运行此脚本。
    echo.
    pause
    exit /b 1
)
echo ✅ Docker Desktop 正在运行
echo.

echo [1/3] 下载 MySQL 8.0 镜像...
docker pull %MIRROR%/mysql:8.0
if %errorlevel% neq 0 (
    echo ❌ MySQL 镜像下载失败
    pause
    exit /b 1
)
docker tag %MIRROR%/mysql:8.0 mysql:8.0
echo ✅ MySQL 镜像下载完成
echo.

echo [2/3] 下载 Python 3.11 镜像...
docker pull %MIRROR%/python:3.11-slim
if %errorlevel% neq 0 (
    echo ❌ Python 镜像下载失败
    pause
    exit /b 1
)
docker tag %MIRROR%/python:3.11-slim python:3.11-slim
echo ✅ Python 镜像下载完成
echo.

echo [3/3] 下载 Node.js 18 镜像...
docker pull %MIRROR%/node:18-alpine
if %errorlevel% neq 0 (
    echo ❌ Node.js 镜像下载失败
    pause
    exit /b 1
)
docker tag %MIRROR%/node:18-alpine node:18-alpine
echo ✅ Node.js 镜像下载完成
echo.

echo [4/4] 验证镜像...
docker images | findstr "mysql python node"
echo.

echo ========================================
echo ✅ 所有镜像下载完成！
echo ========================================
echo.
echo 现在可以运行: docker-compose up --build
echo.
pause
