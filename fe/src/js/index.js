import {ethers, JsonRpcProvider} from "ethers";


document.addEventListener('DOMContentLoaded', function () {
    // 绑定连接钱包按钮事件
    // document.getElementById('connectWalletBtn').addEventListener('click', connectWeb3Wallet);

    // 绑定质押按钮事件
    document.getElementById('stakeBtn').addEventListener('click', stakeTokens);
    // DOM元素
    const connectBtn = document.getElementById('connectWalletBtn');
    const walletInfo = document.getElementById('walletInfo');
    const stakeBtn = document.getElementById('stakeBtn');
    const stakeAmount = document.getElementById('stakeAmount');
    const calcAmount = document.getElementById('calcAmount');
    const durationSlider = document.getElementById('durationSlider');
    const durationValue = document.getElementById('durationValue');
    const rewardValue = document.getElementById('rewardValue');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const withdrawRewardsBtn = document.getElementById('withdrawRewardsBtn');
    const withdrawStakeBtn = document.getElementById('withdrawStakeBtn');
    const secondaryBtns = document.querySelectorAll('.secondary-btn');
    const videos = document.querySelectorAll('.promo-video');

    // 标签页切换
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            // 添加当前活动状态
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 模拟钱包连接
    connectBtn.addEventListener('click', () => {
        connectBtn.style.display = 'none';
        walletInfo.style.display = 'flex';
    });

    // 质押按钮状态管理
    stakeAmount.addEventListener('input', () => {
        stakeBtn.disabled = stakeAmount.value <= 0;
    });

    // 质押按钮点击事件
    stakeBtn.addEventListener('click', () => {
        const amount = stakeAmount.value;
        if (amount > 0) {
            // 模拟交易成功
            stakeAmount.value = '';
            stakeBtn.disabled = true;
            // 显示成功状态
            stakeBtn.innerHTML = '<i class="fas fa-check"></i> Staking Success';
            setTimeout(() => {
                stakeBtn.innerHTML = '<i class="fas fa-lock"></i> Staking ETH';
            }, 3000);
        }
    });

    // 收益计算器逻辑
    function calculateReward() {
        const amount = parseFloat(calcAmount.value) || 0;
        const days = parseInt(durationSlider.value);
        // 年化5%收益计算
        const reward = (amount * 0.05 * days / 365).toFixed(2);
        rewardValue.textContent = `${reward} ETH`;
    }

    calcAmount.addEventListener('input', calculateReward);
    durationSlider.addEventListener('input', () => {
        durationValue.textContent = durationSlider.value;
        calculateReward();
    });

    // 初始化计算器
    calculateReward();

    // MAX按钮功能
    document.querySelectorAll('.max-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const container = this.closest('.input-container');
            if (container) {
                const input = container.querySelector('.token-input');
                if (input) {
                    input.value = input.id === 'stakeAmount' ?
                        document.querySelector('.balance').textContent: '512.63';
                    if (input.id === 'stakeAmount') {
                        stakeBtn.disabled = false;
                    }
                }
            }
        });
    });

    // 次要按钮切换
    secondaryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            secondaryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 禁用视频交互
    videos.forEach(video => {
        video.addEventListener('click', function (e) {
            e.preventDefault();
            return false;
        });

        video.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });

        // 视频结束后重新播放
        video.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        });
    });
});

async function switchNetwork(networkId) {
    if (!window.ethereum) throw new Error('钱包未安装');

    const network = SUPPORTED_NETWORKS[networkId];
    if (!network) throw new Error(`不支持的链ID: ${networkId}`);

    try {
        // 尝试切换网络
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: `0x${networkId.toString(16)}`}] // 转换为十六进制
        });
    } catch (switchError) {
        // 如果网络尚未添加，则添加该网络
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${networkId.toString(16)}`,
                        chainName: network.name,
                        nativeCurrency: {
                            name: network.currencySymbol,
                            symbol: network.currencySymbol,
                            decimals: 18
                        },
                        rpcUrls: [network.rpcUrl],
                        blockExplorerUrls: [network.explorerUrl]
                    }]
                });
            } catch (addError) {
                throw new Error(`添加网络失败: ${addError.message}`);
            }
        } else {
            throw new Error(`切换网络失败: ${switchError.message}`);
        }
    }
}

async function checkNetwork() {
    if (window.ethereum) {
        const chainId = await window.ethereum.request({method: 'eth_chainId'});
        const networkId = parseInt(chainId, 16); // 转换为十进制

        if (SUPPORTED_NETWORKS[networkId]) {
            return networkId;
        } else {
            try {
                await switchNetwork(0);
                return 0;
            } catch (error) {
                console.error('切换网络失败:', error);
                throw new Error(`请切换到支持的网络: ${Object.values(SUPPORTED_NETWORKS).map(n => n.name).join(', ')}`);
            }
        }
    } else {
        throw new Error('请安装MetaMask或其他Web3钱包');
    }
}

// 检查Web3环境
async function connectWeb3Wallet() {
    try {
        // 检查是否安装MetaMask或Web3钱包
        if (window.ethereum) {

            // 请求账户访问权限
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // 检查并切换网络
            const networkId = await checkNetwork();

            if (accounts.length > 0) {
                // 获取连接的账户地址
                const walletAddress = accounts[0];
                // 显示钱包地址（缩短格式）
                const shortenedAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

                // 更新UI显示钱包信息
                document.getElementById('connectWalletBtn').style.display = 'none';
                document.getElementById('walletInfo').style.display = 'flex';
                document.getElementById('walletAddress').textContent = shortenedAddress;

                const contractAddress = SUPPORTED_NETWORKS[networkId].contractAddress;

                // 更新余额和质押信息
                updateWalletInfo(walletAddress, contractAddress);

                // 监听账户变化
                window.ethereum.on('accountsChanged', (newAccounts) => {
                    if (newAccounts.length > 0) {
                        const newAddress = newAccounts[0];
                        document.getElementById('walletAddress').textContent
                            = `${newAddress.substring(0, 6)}...${newAddress.substring(newAddress.length - 4)}`;
                        updateWalletInfo(newAddress);
                    } else {
                        // 用户断开连接
                        document.getElementById('connectWalletBtn').style.display = 'flex';
                        document.getElementById('walletInfo').style.display = 'none';
                    }
                });

                // 监听网络变化
                window.ethereum.on('chainChanged', (chainIdHex) => {
                    const chainId = parseInt(chainIdHex, 16);
                    if (!SUPPORTED_NETWORKS[chainId]) {
                        alert(`不支持的链ID: ${chainId}，请切换回支持的网络`);
                    } else {
                        // 网络切换后重新加载数据
                        const contractAddress = SUPPORTED_NETWORKS[chainId].contractAddress;
                        updateWalletInfo(walletAddress, contractAddress);
                    }
                });

            } else {
                throw new Error('未找到账户');
            }
        } else {
            throw new Error('未检测到Web3钱包。请安装MetaMask或其他Web3钱包。');
        }
    } catch (error) {
        document.getElementById('connectWalletBtn').style.display = 'flex';
        document.getElementById('walletInfo').style.display = 'none';
        console.error('钱包连接失败:', error);
        alert(`钱包连接失败: ${error.message}`);
    }
}

// 质押代币函数（修复验证部分）
async function stakeTokens() {
    const amount = parseFloat(document.getElementById('stakeAmount').value);

    // 验证质押数量（修复这一行）
    if (isNaN(amount) || amount <= 0) {
        alert('请输入有效的质押数量');
        return;
    }

    try {
        // 显示交易进行中状态
        const stakeBtn = document.getElementById('stakeBtn');
        stakeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        stakeBtn.disabled = true;
        
        // 获取用户输入的质押数量
        const amountInput = document.getElementById('stakeAmount');
        const amount = parseFloat(amountInput.value);
        
        // 验证输入
        if (isNaN(amount) || amount <= 0) {
            throw new Error("请输入有效的质押数量");
        }
        
        // 获取智能合约实例
        SUPPORTED_NETWORKS[provider.network.chainId];
        const contractAddress = "0xYourContractAddress"; // 替换为实际合约地址
        const contractABI = [...]; // 替换为实际合约ABI
        
        // 获取签名者（已连接的钱包）
        const signer = await modal.getSigner();
        
        // 创建合约实例
        const stakingContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // 调用智能合约的质押函数
        const tx = await stakingContract.stake(
            ethers.parseEther(amount.toString()), // 转换为wei
            { 
                gasLimit: 300000, // 设置合适的gas限制
                value: ethers.parseEther(amount.toString()) // 如果是ETH质押需要包含value
            }
        );
        
        // 显示交易哈希
        console.log("交易已发送，哈希:", tx.hash);
        
        // 等待交易确认（2个区块确认）
        const receipt = await tx.wait(2);
        console.log("交易已确认，区块:", receipt.blockNumber);
        
        // 更新余额显示（从链上获取最新余额）
        const address = await signer.getAddress();
        const newBalance = await getEthBalance(address);
        const balanceElement = document.getElementById('ETHbalance');
        balanceElement.textContent = `${newBalance} ETH`;
        
        // 更新质押信息（从智能合约事件或状态读取）
        const stakedAmount = await stakingContract.getStakedAmount(address);
        const stakedAmountElement = document.querySelector('.status-value');
        stakedAmountElement.textContent = `${ethers.formatEther(stakedAmount)} ETH`;
        
        // 显示交易成功
        stakeBtn.innerHTML = '<i class="fas fa-check"></i> Staking Success';
        stakeBtn.style.background = 'var(--primary)';
        
        // 3秒后恢复按钮状态
        setTimeout(() => {
            stakeBtn.innerHTML = '<i class="fas fa-lock"></i> Staking';
            stakeBtn.disabled = false;
            amountInput.value = '';
        }, 3000);
    } catch (error) {
        console.error('质押失败:', error);
        
        // 用户友好的错误消息
        let errorMessage = "交易失败";
        if (error.code === "INSUFFICIENT_FUNDS") {
            errorMessage = "余额不足";
        } else if (error.code === "ACTION_REJECTED") {
            errorMessage = "用户拒绝了交易";
        } else if (error.message.includes("exceeds balance")) {
            errorMessage = "质押金额超过余额";
        }
        
        alert(`质押失败: ${errorMessage}`);
        
        const stakeBtn = document.getElementById('stakeBtn');
        stakeBtn.innerHTML = '<i class="fas fa-lock"></i> Staking';
        stakeBtn.disabled = false;
    }
}

const SUPPORTED_NETWORKS = {
    31337: {
        name: 'Localhost',
        chainId: 31337,
        rpcUrl: 'https://b224-112-10-132-186.ngrok-free.app',
        explorerUrl: 'http://localhost:3000',
        currencySymbol: 'ETH',
        contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    },
    1: {
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
        explorerUrl: 'https://etherscan.io',
        currencySymbol: 'ETH',
        contractAddress: '0x...' // 主网合约地址
    }
}

async function getRealBalance(walletAddress) {
    try {
        // 1. 连接以太坊主网（使用公共 RPC 节点）
        const provider = new JsonRpcProvider('https://sepolia.infura.io/v3/1d83645699b6449cb5b609abc08f0a87');

        // 2. 获取指定地址的 ETH 余额（单位：Wei）
        const balanceWei = await provider.getBalance(walletAddress);

        // 3. 将 Wei 转换为 ETH（显示为 4 位小数）
        const balanceEth = ethers.formatEther(balanceWei);
        return parseFloat(balanceEth).toFixed(4);
    } catch (error) {
        console.error('获取 ETH 余额失败:', error);
        throw error; // 向上抛出错误，由调用者处理
    }
}

async function getRealStakingInfo(walletAddress, contractAddress) {
    // 使用传入的contractAddress创建质押合约实例
    // ...
}

// 更新钱包信息函数
async function updateWalletInfo(walletAddress, contractAddress) {
    try {
        // 模拟从区块链获取钱包余额
        const balance = await getRealBalance(walletAddress);
        const stakingInfo = await getRealStakingInfo(walletAddress, contractAddress);

        // 更新余额显示
        const balanceElement = document.querySelector('.balance');
        if (balanceElement) {
            balanceElement.textContent = `${parseFloat(balance).toFixed(2)} ETH`;
        }

        // 更新质押信息
        const stakedAmountElement = document.querySelectorAll('.status-value')[0];
        const pendingRewardsElement = document.querySelectorAll('.status-value')[1];
        const withdrawableElement = document.querySelectorAll('.status-value')[2];

        if (stakedAmountElement) {
            stakedAmountElement.textContent = `${stakingInfo.stakedAmount.toFixed(2)} ETH`;
        }
        if (pendingRewardsElement) {
            pendingRewardsElement.textContent = `${stakingInfo.pendingRewards.toFixed(2)} ETH`;
            // 添加primary类使其高亮显示
            pendingRewardsElement.classList.add('primary');
        }
        if (withdrawableElement) {
            withdrawableElement.textContent = `${stakingInfo.withdrawable.toFixed(2)} ETH`;
        }

        // 更新提款页面中的可提取余额
        const withdrawBalanceElement = document.querySelector('#withdrawTab .balance');
        if (withdrawBalanceElement) {
            const totalWithdrawable = stakingInfo.pendingRewards + stakingInfo.withdrawable;
            withdrawBalanceElement.textContent = `${totalWithdrawable.toFixed(2)} ETH`;
        }

    } catch (error) {
        console.error('更新钱包信息失败:', error);
        alert(`更新钱包信息失败: ${error.message}`);
    }
}

// 模拟获取钱包余额
async function getSimulatedBalance(walletAddress) {
    // 在实际应用中，这里应该调用智能合约或API获取真实余额
    // 这里我们使用随机值模拟
    return new Promise(resolve => {
        setTimeout(() => {
            // 生成1000-5000之间的随机余额
            const balance = 1000 + Math.random() * 4000;
            resolve(balance);
        }, 500);
    });
}

// 模拟获取质押信息
async function getSimulatedStakingInfo(walletAddress) {
    // 在实际应用中，这里应该调用智能合约或API获取真实质押信息
    // 这里我们使用随机值模拟
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                // 已质押金额（300-800之间）
                stakedAmount: 300 + Math.random() * 500,
                // 待提取收益（5-50之间）
                pendingRewards: 5 + Math.random() * 45,
                // 可提取质押（100-500之间）
                withdrawable: 100 + Math.random() * 400
            });
        }, 500);
    });
}

