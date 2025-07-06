# 使用官方 Node.js 运行时作为父镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和其他必要的文件
COPY package*.json ./

# 安装项目依赖项
RUN npm install

# 将其余的应用程序代码复制到容器中
COPY . .

# 如果是生产环境，则构建应用
RUN npm run build

# 生产环境中，我们需要一个服务器来提供静态文件。
# 我们可以使用一个轻量级的 HTTP 服务器如 'serve'
RUN npm install -g serve

# 暴露端口
EXPOSE 3000

# 启动命令，运行构建后的应用
CMD ["serve", "-s", "dist", "-l", "3000"]