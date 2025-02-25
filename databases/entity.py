from datetime import datetime

from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from databases.db import EntityBase, bigint_pk


class Article(EntityBase):
    __tablename__ = "articles"
    __table_args__ = {
        "comment": "arti-red record table",
    }

    id: Mapped[bigint_pk] = mapped_column(init=False)
    url: Mapped[str] = mapped_column(String(5000), server_default='', nullable=False)
    secret: Mapped[str] = mapped_column(String(32), server_default='', nullable=False)
    uuid: Mapped[str] = mapped_column(String(32), server_default='', nullable=False)
    expired_time: Mapped[datetime] = mapped_column(server_default=None)

