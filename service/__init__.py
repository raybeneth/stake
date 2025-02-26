from databases import Config

config = Config()

secret = str(config.get('aes-secret'))
