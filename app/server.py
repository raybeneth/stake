from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.generate import router as gen_router

# 注册路由
app = FastAPI()
app.include_router(gen_router)


# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许的源
    allow_credentials=True,  # 允许发送凭据
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头
)