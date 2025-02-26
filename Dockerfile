# 第一阶段：构建环境
FROM python:3.12-slim AS builder

# 设置工作目录
WORKDIR /app

# 复制项目文件并安装依赖
COPY . .

# 安装依赖（包括开发依赖）
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 第二阶段：生产环境
FROM python:3.12-slim

# 设置工作目录
WORKDIR /app

# 从构建阶段复制必要的文件
COPY --from=builder /app /app

# 暴露应用运行所需的端口（例如 Flask 的默认端口是 5000）
EXPOSE 5000

# 安装 Gunicorn
RUN pip install gunicorn

# 运行应用的命令
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]