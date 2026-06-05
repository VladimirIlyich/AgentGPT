@echo off
chcp 65001 >nul
setlocal

echo ========================================
echo Docker 网络连接诊断工具
echo ========================================
echo.

echo [1/4] 检查 Docker Desktop 状态...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop 未运行！
    echo 请先启动 Docker Desktop
    pause
    exit /b 1
)
echo ✅ Docker Desktop 正在运行
echo.

echo [2/4] 检查 Docker 镜像加速器配置...
docker info | findstr /C:"Registry Mirrors" >nul
if %errorlevel% equ 0 (
    echo ✅ 已配置镜像加速器：
    docker info | findstr /C:"Registry Mirrors" -A 5
) else (
    echo ⚠️  未检测到镜像加速器配置
    echo.
    echo 建议配置镜像加速器（国内用户）：
    echo 1. 打开 Docker Desktop
    echo 2. Settings ^> Docker Engine
    echo 3. 添加以下配置：
    echo    "registry-mirrors": [
    echo      "https://docker.mirrors.ustc.edu.cn",
    echo      "https://hub-mirror.c.163.com"
    echo    ]
    echo 4. 点击 Apply ^& Restart
)
echo.

echo [3/4] 测试网络连接...
echo 测试访问 Docker Hub...
ping -n 2 registry-1.docker.io >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 可以访问 Docker Hub
) else (
    echo ❌ 无法访问 Docker Hub
    echo 可能需要：
    echo - 配置镜像加速器
    echo - 使用代理/VPN
    echo - 检查防火墙设置
)
echo.

echo [4/4] 尝试拉取测试镜像...
echo 正在测试拉取 hello-world 镜像...
docker pull hello-world >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 镜像拉取成功！网络连接正常
    docker rmi hello-world >nul 2>&1
) else (
    echo ❌ 镜像拉取失败
    echo.
    echo 可能的原因：
    echo 1. 网络无法访问 Docker Hub（需要配置镜像加速器）
    echo 2. 需要登录 Docker Hub（通常不需要）
    echo 3. 防火墙/代理阻止连接
    echo.
    echo 解决方案：
    echo 请查看 fix-docker-registry.md 文件获取详细配置步骤
)
echo.

echo ========================================
echo 诊断完成
echo ========================================
echo.
pause
