from sqlalchemy import create_engine

from databases.config import Config
from databases.db import DatabaseManager

config = Config()

# 业务库配置信息
db_config = config.get('db')
db_host = db_config['host']
db_port = db_config['port']
db_username = db_config['username']
db_password = db_config['password']
db_database = db_config['database']
engine = create_engine(
    f"mysql+pymysql://{db_username}:{db_password}@{db_host}:{db_port}/"
    f"{db_database}",
    **db_config.get('params', {}),
)
db = DatabaseManager(engine=engine)
