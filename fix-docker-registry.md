# Docker 镜像拉取问题解决方案

## 问题：pull access denied

如果遇到 `pull access denied for python, repository does not exist or may require 'docker login'` 错误，通常是网络问题。

## 解决方案

### 方案 1：配置 Docker 镜像加速器（推荐，国内用户必看）

1. **打开 Docker Desktop**
2. **进入设置**：点击右上角齿轮图标 ⚙️
3. **选择 Docker Engine**
4. **添加镜像加速器配置**，在 JSON 配置中添加：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

5. **点击 Apply & Restart**
6. **等待 Docker 重启完成**

### 方案 2：使用国内镜像源直接拉取

如果配置镜像加速器后仍然失败，可以尝试使用国内镜像源：

```bash
# 使用阿里云镜像（需要替换为你的专属加速地址）
docker pull registry.cn-hangzhou.aliyuncs.com/library/python:3.11-slim
docker tag registry.cn-hangzhou.aliyuncs.com/library/python:3.11-slim python:3.11-slim

docker pull registry.cn-hangzhou.aliyuncs.com/library/node:18-alpine
docker tag registry.cn-hangzhou.aliyuncs.com/library/node:18-alpine node:18-alpine

docker pull registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0
docker tag registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0 mysql:8.0
```

### 方案 3：登录 Docker Hub（通常不需要）

如果确实需要登录：

```bash
docker login
# 输入 Docker Hub 用户名和密码
```

### 方案 4：检查网络连接

```bash
# 测试是否能访问 Docker Hub
ping registry-1.docker.io

# 或者测试 HTTPS 连接
curl -I https://registry-1.docker.io/v2/
```

### 方案 5：使用代理

如果使用代理，需要在 Docker Desktop 中配置：
1. **Settings > Resources > Proxies**
2. 配置 HTTP/HTTPS 代理

## 验证配置

配置完成后，运行：

```bash
docker info | findstr "Registry Mirrors"
```

应该能看到配置的镜像加速器地址。

## 重新尝试

配置完成后，重新运行：

```bash
.\pre-download-images.bat
```
