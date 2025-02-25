import uuid

from databases import db
from databases.entity import Article


def generate_anti_red_uuid(url):
    with db.session() as session:
        identity_id = str(uuid.uuid4())
        session.add(Article(url=url, uuid=identity_id, secret=str(uuid.uuid4())))
        session.commot()
    return identity_id


def get_by_identity_id(identity_id) -> str:
    with db.session() as session:
        article_one = session.query(Article).filter(Article.uuid == identity_id).one()
        if not article_one:
            return ""
    return article_one.secret
