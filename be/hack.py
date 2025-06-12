import requests
import secrets
import time
import json
from eth_account import Account
from datetime import datetime

# 配置参数
SIMILARITY_LENGTH = 3  # 地址相似字符长度
LOG_FILE = "../service/address_log.json"  # 日志文件
API_KEYS = {
    "ethereumscan": "HXQ8RV8JDAFZQUIV77DD74CX7MVSJ79GHF",
    "bscscan": "YOUR_BSCSCAN_API_KEY",
    "polygonscan": "YOUR_POLYGONSCAN_API_KEY"
}

# 支持的区块链及其浏览器API
BLOCKCHAINS = {
    "ethereum": {
        "name": "Ethereum",
        "api_url": "https://api.etherscan.io/api",
        "tx_url": "https://etherscan.io/tx/"
    },
    "bsc": {
        "name": "Binance Smart Chain",
        "api_url": "https://api.bscscan.com/api",
        "tx_url": "https://bscscan.com/tx/"
    },
    "polygon": {
        "name": "Polygon",
        "api_url": "https://api.polygonscan.com/api",
        "tx_url": "https://polygonscan.com/tx/"
    }
}


def generate_similar_address(target_address, length=4, use_prefix=True):
    """
    生成与目标地址相似的新地址
    """
    target = target_address.lower()[2:]  # 移除0x
    start_time = time.time()

    for _ in range(10000000):  # 安全限制尝试次数
        # 生成随机私钥和地址
        private_key = "0x" + secrets.token_hex(32)
        account = Account.from_key(private_key)
        address_hex = account.address[2:].lower()

        # 检查相似性
        if use_prefix:
            if address_hex.startswith(target[:length]):
                return account.address, private_key
        else:
            if address_hex.endswith(target[-length:]):
                return account.address, private_key

        # 超时保护
        if time.time() - start_time > 30000:
            return None, None

    return None, None


def get_latest_transactions(blockchain):
    """
    从区块链浏览器获取最新交易
    """
    api_url = blockchain["api_url"]
    api_key = API_KEYS.get(f"{blockchain['name'].lower()}scan", "")

    params = {
        "module": "account",
        "action": "txlist",
        "startblock": "latest",
        "endblock": "latest",
        "sort": "desc",
        "address": "0x397cA8B793C38029831B40eDdEd9Ca07Cc5C3ce1",
        "apikey": api_key
    }

    try:
        response = requests.get(api_url, params=params, timeout=10)
        data = response.json()

        if data["status"] == "1" and data["message"] == "OK":
            return data["result"]
        else:
            print(f"API Error: {data.get('message', 'Unknown error')}")
            return []
    except Exception as e:
        print(f"Network Error: {str(e)}")
        return []


def log_address(original_address, similar_address, private_key, blockchain, tx_hash):
    """
    记录生成的地址到文件
    """
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "blockchain": blockchain["name"],
        "original_address": original_address,
        "similar_address": similar_address,
        "private_key": private_key,
        "transaction_hash": tx_hash,
        "explorer_link": f"{blockchain['tx_url']}{tx_hash}"
    }

    # 追加到日志文件
    try:
        with open(LOG_FILE, "a") as f:
            f.write(json.dumps(entry) + "\n")
        print(f"Logged address to {LOG_FILE}")
    except Exception as e:
        print(f"Logging failed: {str(e)}")


def monitor_blockchain(blockchain_name):
    """
    监控指定区块链的交易
    """
    blockchain = BLOCKCHAINS.get(blockchain_name.lower())
    if not blockchain:
        print(f"Unsupported blockchain: {blockchain_name}")
        return

    print(f"Starting monitor for {blockchain['name']}...")
    last_processed = {}

    while True:
        try:
            transactions = get_latest_transactions(blockchain)

            for tx in transactions:
                tx_hash = tx["hash"]

                # 跳过已处理的交易
                if tx_hash in last_processed:
                    continue

                last_processed[tx_hash] = True

                # 只处理成功的交易
                if tx.get("isError", "0") != "0" or tx.get("txreceipt_status") != "1":
                    continue

                from_address = tx["from"]
                to_address = tx["to"]

                if not to_address:
                    continue

                print(f"\nNew transaction on {blockchain['name']}:")
                print(f"From: {from_address}")
                print(f"To: {to_address}")
                print(f"Value: {int(tx['value']) / 10 ** 18} ETH")
                print(f"TX Hash: {tx_hash}")

                # 生成相似地址
                similar_address, priv_key = generate_similar_address(
                    to_address,
                    length=SIMILARITY_LENGTH,
                    use_prefix=True
                )

                if similar_address and priv_key:
                    print(f"\nGenerated similar address:")
                    print(f"Original: {to_address}")
                    print(f"Similar:  {similar_address}")
                    print(f"Private Key: {priv_key}")

                    # 记录地址
                    log_address(to_address, similar_address, priv_key, blockchain, tx_hash)
                else:
                    print("Failed to generate similar address in time limit")



        except Exception as e:
            print(f"Monitoring error: {str(e)}")
        time.sleep(10)  # 每10秒检查一次


def main():
    print("Blockchain Address Monitor")
    print("=" * 40)

    # 选择要监控的区块链
    chains = ", ".join(BLOCKCHAINS.keys())
    blockchain = input(f"Select blockchain to monitor ({chains}): ").strip()

    if blockchain.lower() not in BLOCKCHAINS:
        print("Invalid blockchain selection. Exiting.")
        return

    try:
        monitor_blockchain(blockchain)
    except KeyboardInterrupt:
        print("\nMonitoring stopped")


if __name__ == "__main__":
   main()
