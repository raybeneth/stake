import secrets
from eth_account import Account

def generate_custom_address(suffix: str):
    suffix = suffix.lower()

    while True:
        private_key = "0x" + secrets.token_hex(32)
        account = Account.from_key(private_key)
        address = account.address[2:].lower()  # 去掉 0x 并转为小写

        if address.endswith(suffix):
            return private_key, address

# 示例：寻找后缀为 "c3d4" 的地址
private_key, address = generate_custom_address("c3d4")
print(f"Found address: {address}")
print(f"Private key: {private_key}")