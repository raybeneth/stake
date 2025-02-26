from typing import Optional

from sqlalchemy import String, DateTime, Boolean, ForeignKey, BigInteger, Integer
from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from datetime import datetime

# 创建一个基础类，用于声明继承
Base = declarative_base()


class AntiRedDomain(Base):
    __tablename__ = "anti_red_domain"
    __table_args__ = {
        "comment": "域名列表"
    }

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True, comment="主键")
    state: Mapped[int] = mapped_column(Boolean, default=True, nullable=False, comment="数据状态（0=无效；1=有效；）")
    create_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, nullable=False, comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False,
                                                  comment="更新时间")
    domain: Mapped[str] = mapped_column(String(1000), nullable=False, comment="域名")
    used_times: Mapped[int] = mapped_column(Integer, default=0, nullable=False, comment="使用次数")


class AntiRedRecord(Base):
    __tablename__ = "anti_red_records"
    __table_args__ = {
        "comment": "防红记录"
    }

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True, comment="主键")
    state: Mapped[int] = mapped_column(Boolean, default=True, nullable=False, comment="数据状态（0=无效；1=有效；）")
    create_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, nullable=False, comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False,
                                                  comment="更新时间")
    source_url: Mapped[str] = mapped_column(String(5000), nullable=False, comment="防红原始地址")
    domain_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("anti_red_domain.id"), nullable=False,
                                           comment="域名ID")
    uuid: Mapped[str] = mapped_column(String(32), nullable=False, comment="唯一ID")
    ciphertext: Mapped[str] = mapped_column(String(2000), nullable=False, comment="加密密文")
    expired_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, comment="过期时间")
