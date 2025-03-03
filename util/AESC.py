from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64
from os import urandom
from hashlib import sha256


def _prepare_key(key: str) -> bytes:
    return sha256(key.encode('utf-8')).digest()


class AESCipher:
    def __init__(self, key: str):
        self.key = _prepare_key(key)

    def encrypt(self, plaintext: str) -> str:
        # 生成新的IV
        iv = urandom(16)
        cipher = Cipher(algorithms.AES(self.key), modes.CFB(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(plaintext.encode('utf-8')) + encryptor.finalize()
        # 将IV和密文一起返回
        return base64.b64encode(iv + ciphertext).decode('utf-8')

    def decrypt(self, ciphertext_b64: str) -> str:
        data = base64.b64decode(ciphertext_b64.encode('utf-8'))
        iv = data[:16]
        real_ciphertext = data[16:]
        cipher = Cipher(algorithms.AES(self.key), modes.CFB(iv), backend=default_backend())
        decrypted = cipher.decryptor()
        decrypted_data = decrypted.update(real_ciphertext) + decrypted.finalize()
        return decrypted_data.decode('utf-8')
