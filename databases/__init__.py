from sqlalchemy import create_engine
from urllib.parse import quote_plus
from databases.config import Config
from databases.db import DatabaseManager

config = Config()

# 业务库配置信息
db_config = config.get('db')
db_host = db_config['host']
db_port = db_config['port']
db_username = quote_plus(db_config['username'], encoding='utf-8')
db_password = quote_plus(db_config['password'], encoding='utf-8')
db_database = db_config['database']
engine = create_engine(
    f"mysql+pymysql://{db_username}:{db_password}@{db_host}:{db_port}/"
    f"{db_database}",
    **db_config.get('params', {}),
)
db = DatabaseManager(engine=engine)
