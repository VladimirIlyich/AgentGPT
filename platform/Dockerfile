FROM docker.m.daocloud.io/library/python:3.11-slim as prod

# 为 Debian trixie 写入国内镜像源（slim 镜像可能没有 /etc/apt/sources.list）
RUN printf 'deb http://mirrors.tuna.tsinghua.edu.cn/debian trixie main contrib non-free non-free-firmware\n\
deb http://mirrors.tuna.tsinghua.edu.cn/debian trixie-updates main contrib non-free non-free-firmware\n\
deb http://mirrors.tuna.tsinghua.edu.cn/debian-security trixie-security main contrib non-free non-free-firmware\n' \
  > /etc/apt/sources.list

# 安装构建依赖，并增加稳定性参数与重试
RUN apt-get update -o Acquire::http::Timeout=30 -o Acquire::Retries=5 \
  && apt-get install -y --no-install-recommends \
  default-libmysqlclient-dev \
  gcc \
  pkg-config \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==1.4.2

# Configuring poetry
RUN poetry config virtualenvs.create false

# Copying requirements of a project
COPY pyproject.toml /app/src/
WORKDIR /app/src

# Installing requirements
RUN poetry install --only main
# Removing gcc
RUN apt-get purge -y \
  g++ \
  gcc \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

# Copying actual application
COPY . /app/src/
RUN poetry install --only main \
  && pip install "lanarky>=0.7.15,<0.7.17"

CMD ["/usr/local/bin/python", "-m", "reworkd_platform"]

FROM prod as dev

RUN poetry install
