FROM registry.cn-hangzhou.aliyuncs.com/sudoom/python:3.12.2

WORKDIR /usr/src/app
ENV PROFILE test

COPY requirements.txt ./
RUN pip install --cache-dir=./cache -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com -r requirements.txt
ENV PYTHONPATH /usr/src/app

COPY . .

CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0"]
