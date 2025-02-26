import uuid

from service import secret
from util.AESC import AESCipher
from databases import db
from databases.entity import AntiRedRecord, AntiRedDomain


def generate_anti_red_uri(source_url):
    with db.session() as session:
        # 获取已经配置过的防红链接
        granted = session.query(AntiRedRecord).filter(AntiRedRecord.state == 1).filter(
            AntiRedRecord.source_url == source_url).first()
        # 配置过了，查询所配置的域名
        if granted is not None:
            domain_one = get_anti_red_domain(granted.domain_id)
            return generate_uri(domain=domain_one.domain, identity_id=granted.uuid)
        domain_one = get_anti_red_domain(None)
        identity_id = str(uuid.uuid4())
        encrypt_str = AESCipher(secret).encrypt(source_url)
        record = AntiRedRecord(source_url=source_url, uuid=identity_id, domain_id=domain_one.id, ciphertext=encrypt_str)
        session.add(record)
        session.commit()
    return generate_uri(domain=domain_one.domain, identity_id=identity_id)


def get_anti_red_domain(domain_id: int | None):
    """根据域名ID查询域名信息，如果ID为空则查询一条可用的"""
    with db.session() as session:
        session.expire_on_commit = False
        query = session.query(AntiRedDomain).filter(AntiRedDomain.state == 1)
        if domain_id:
            query = query.filter(AntiRedDomain.id == domain_id)
        domain_one = query.order_by(AntiRedDomain.used_times.asc()).first()
        if domain_one is None or domain_one.domain is None:
            raise Exception("No domain name available")
        return domain_one


def generate_uri(domain: str, identity_id: str):
    """生成加密的跳转链接"""
    return domain + "?uuid=" + identity_id

