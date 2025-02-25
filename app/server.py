from fastapi import FastAPI
from api.generate import router as gen_router

# 注册路由
app = FastAPI()
app.include_router(gen_router)
