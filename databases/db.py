from contextlib import contextmanager
from datetime import datetime
from typing import Annotated

import pydantic
from sqlalchemy import Engine, BIGINT
from sqlalchemy.orm import scoped_session, sessionmaker, Session, MappedAsDataclass, DeclarativeBase, mapped_column


class DatabaseManager:

    def __init__(self, engine):
        """
        初始化数据库引擎
        :param engine: 引擎
        """
        self._engine: Engine = engine
        self._session = scoped_session(sessionmaker(bind=engine))

    @contextmanager
    def session(self, commit: None = True) -> Session:
        session = self._session()
        try:
            yield session
            if commit:
                session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    @contextmanager
    def session_trans(self) -> Session:
        session = self._session()
        in_trans: bool = session.in_transaction()
        if not in_trans:
            session.begin()

        try:
            yield session
            if not in_trans:
                session.commit()
        except Exception as e:
            if not in_trans:
                session.rollback()
            raise e
        finally:
            if not in_trans:
                session.close()


class EntityBase(
    MappedAsDataclass,
    DeclarativeBase,
    dataclass_callable=pydantic.dataclasses.dataclass,
):
    """
    数据库实体基类
    """
    pass


"""
通用字段
"""
bigint_pk = Annotated[int, mapped_column(BIGINT(), primary_key=True, autoincrement=True)]
create_time_column = Annotated[datetime, mapped_column(insert_default=datetime.now)]
update_time_column = Annotated[
    datetime, mapped_column(insert_default=datetime.now, onupdate=datetime.now)
]
