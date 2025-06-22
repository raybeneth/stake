import json
from web3 import Web3
from web3.exceptions import TransactionNotFound

# 1. 连接到本地 Hardhat 节点
LOCAL_RPC_URL = "https://b224-112-10-132-186.ngrok-free.app"
w3 = Web3(Web3.HTTPProvider(LOCAL_RPC_URL))

# 确保连接成功
assert w3.is_connected(), "无法连接到本地 Hardhat 节点"

# 2. 设置账户和私钥
# Hardhat 默认提供了 20 个测试账户，第一个账户是：
PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ACCOUNT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

w3.eth.default_account = ACCOUNT_ADDRESS

# 3. 加载合约 ABI 和字节码
CONTRACT_NAME = "Transfer"

with open(f"../fe/artifacts/contracts/{CONTRACT_NAME}.sol/{CONTRACT_NAME}.json") as f:
    contract_json = json.load(f)
    abi = contract_json["abi"]
    bytecode = contract_json["bytecode"]

contract_address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

# 5. 实例化合约对象
contract = w3.eth.contract(address=w3.to_checksum_address(contract_address), abi=abi)

# 6. 准备调用 transferZero 方法
token_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7" # usdt地址
from_address = ACCOUNT_ADDRESS
to_address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"     # Hardhat 提供的另一个账户

# 构造交易
nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

tx = contract.functions.transferZero(token_address, from_address, to_address).build_transaction({
    "chainId": 31337,        # Hardhat 默认 chainId
    "from": ACCOUNT_ADDRESS,
    "nonce": nonce,
    "gas": 300_000,
    "gasPrice": w3.to_wei("20", "gwei")
})

# 签名并发送交易
signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

# 等待确认
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
print(f"✅ 交易成功，哈希: {tx_hash.hex()}")