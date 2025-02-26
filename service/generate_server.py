import uuid

from service import secret
from util.AESC import AESCipher
from databases import db
from databases.entity import AntiRedRecord, AntiRedDomain


def generate_anti_red_uri(source_url):
    with db.session() as session:
        """ Get a available domain """
        domain_one = session.query(AntiRedDomain).filter(AntiRedDomain.state == 1).order_by(
            AntiRedDomain.used_times.asc()).first()
        if domain_one is None or domain_one.domain is None:
            raise Exception("No domain name available")
        domain_one.used_times += 1
        """ Encrypt source URL, mapping uuid in this record """
        identity_id = str(uuid.uuid4())
        encrypt_str = AESCipher(secret).encrypt(source_url)
        record = AntiRedRecord(source_url=source_url, uuid=identity_id, domain_id=domain_one.id, ciphertext=encrypt_str)
        session.add(record)
        session.commit()
    return domain_one.domain + "?uuid=" + identity_id


def get_by_identity_id(identity_id) -> str:
    with db.session() as session:
        article_one = session.query(AntiRedRecord).filter(AntiRedRecord.uuid == identity_id).one()
        if not article_one:
            return ""
    return article_one.ciphertext
