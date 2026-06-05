@echo off
chcp 65001 >nul
setlocal

echo ========================================
echo AgentGPT 设置脚本
echo ========================================
echo.

rem  检查 Docker Desktop 是否运行
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

rem  The CLI will take care of setting up the ENV variables
cd cli
if %errorlevel% neq 0 (
    echo ❌ 无法进入 cli 目录
    pause
    exit /b 1
)

echo [1/2] 安装 CLI 依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ CLI 依赖安装失败！
    pause
    exit /b 1
)
echo ✅ CLI 依赖安装完成
echo.

echo [2/2] 启动设置向导...
echo.
echo ⚠️  注意：如果选择 Docker 模式，构建过程可能需要较长时间
echo    请耐心等待，不要关闭窗口
echo.

npm run start

rem  如果脚本执行到这里，说明可能出错了
if %errorlevel% neq 0 (
    echo.
    echo ❌ 设置过程中出现错误
    echo.
    echo 常见问题：
    echo 1. Docker 构建失败 - 检查 Docker Desktop 是否正常运行
    echo 2. 端口被占用 - 确保 3000、8000、3308 端口未被使用
    echo 3. 网络问题 - 检查是否能正常下载 Docker 镜像
    echo.
)

pause
