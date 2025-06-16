import './css/style.css'
import './js/index.js'
import { createAppKit } from '@reown/appkit'
import { sepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 1. 从 https://cloud.reown.com 获取项目ID
const projectId = 'bc8f2a1b3cd268f8295dd93917c4173a'

export const networks = [sepolia]

// 2. 设置Wagmi适配器
const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
})

// 3. 配置元数据
const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'http://127.0.0.1:5173',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. 创建模态框
const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks: [sepolia],
    metadata,
    projectId,
    features: {
        analytics: false // 可选 - 默认为您的云配置
    }
})

// 先设置HTML内容
document.querySelector('#app').innerHTML = `
<!-- 导航栏 -->
<nav class="navbar">
    <div class="logo-container">
        <div class="logo">ES</div>
        <div class="logo-text">Easy(ETH) Staking</div>
    </div>
    <div class="nav-links">
        <a href="#" class="active">HOME</a>
    </div>
    <div class="wallet-section">
        <button class="connect-btn" id="connectWalletBtn">
            <i class="fas fa-wallet"></i> Connect Wallet
        </button>
        <div class="wallet-info" id="walletInfo" style="display: none;">
            <i class="fas fa-wallet"></i>
            <span id="walletAddress">Loading...</span>
        </div>
    </div>
</nav>

<div class="container">
    <!-- PC端顶部横幅 -->
    <div class="top-banner">
        <div class="slogan-container">
            <div class="slogan">A safe and efficient token staking solution</div>
            <div class="slogan-subtext">
                Our platform offers an industry-leading annualized rate of return of 5%, ensuring the security of funds
                through blockchain technology and achieving stable asset appreciation.
                Zero transaction fees, real-time returns, and flexible access provide the best value-added solution for
                your digital assets.
            </div>
            <div class="slogan-features">
                <div class="feature-tag">5% annualized return</div>
                <div class="feature-tag">Zero handling fee</div>
                <div class="feature-tag">Real-time revenue</div>
                <div class="feature-tag">Safe and reliable</div>
                <div class="feature-tag">Flexible access</div>
            </div>
        </div>

        <div class="video-container">
            <video class="promo-video" autoplay loop muted playsinline>
                <source src="https://web3.okx.com/cdn/assets/files/241/57C1258631DC562B.mp4" type="video/mp4">
            </video>
        </div>
    </div>

    <!-- 移动端视频 -->
    <div class="mobile-video-container">
        <video class="promo-video" autoplay loop muted playsinline>
            <source src="https://web3.okx.com/cdn/assets/files/241/57C1258631DC562B.mp4" type="video/mp4">
        </video>
    </div>

    <!-- 移动端宣传语 -->
    <div class="mobile-slogan-container">
        <div class="slogan">A safe and efficient token staking solution</div>
        <div class="slogan-subtext" style="margin-top: 15px;">
            5% annualized return · Zero transaction fees · Real-time returns · Safe and reliable · Flexible access
        </div>
    </div>

    <!-- 功能区域标题 -->
    <h2 class="section-title">Token staking service</h2>

    <!-- 标签页导航 -->
    <div class="tabs">
        <button class="tab-btn active" data-tab="stake">Easy Staking</button>
        <button class="tab-btn" data-tab="withdraw">Withdrawal</button>
        <button class="tab-btn" data-tab="calculator">Calculation</button>
    </div>

    <!-- 质押卡片 -->
    <div class="tab-content active" id="stakeTab">
        <div class="content-card">
            <h2 class="card-title">
                <i class="fas fa-lock"></i>
                Staking tokens
            </h2>
            <div class="apy-badge">
                <i class="fas fa-percentage"></i> Annualized rate of return: 5%
            </div>
            <div class="input-group">
                <div class="input-label">
                    <span>Quantity of pledge</span>
                    <span>Balance: <span class="balance" id="ETHbalance">0 ETH</span></span>
                </div>
                <div class="input-container">
                    <input type="number" class="token-input" id="stakeAmount" placeholder="0.0" min="0" step="0.01">
                    <div class="input-actions">
                        <button class="max-btn">MAX</button>
                        <span style="color: var(--text-secondary); font-weight: 500;padding-top: 5px;">ETH</span>
                    </div>
                </div>
            </div>
            <button class="action-btn" id="stakeBtn" disabled>
                <i class="fas fa-lock"></i> STAKING
            </button>
        </div>
    </div>

    <!-- 提款卡片 -->
    <div class="tab-content" id="withdrawTab">
        <div class="content-card">
            <h2 class="card-title">
                <i class="fas fa-coins"></i>
                Withdraw funds
            </h2>
            <div class="status-info">
                <div class="status-item">
                    <span class="status-label">Total amount of pledge</span>
                    <span class="status-value">850.25 ETH</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Earnings to be withdrawn</span>
                    <span class="status-value primary">12.63 ETH</span>
                </div>
                <div class="status-item">
                    <span class="status-label">The pledge can be withdrawn</span>
                    <span class="status-value">500.00 ETH</span>
                </div>
            </div>
            <div class="input-group">
                <div class="input-label">
                    <span>Extraction quantity</span>
                    <span>Extractable: <span class="balance">512.63 ETH</span></span>
                </div>
                <div class="input-container">
                    <input type="number" class="token-input" id="withdrawAmount" placeholder="0.0" min="0" step="0.01">
                    <div class="input-actions">
                        <button class="max-btn">MAX</button>
                        <span style="color: var(--text-secondary); font-weight: 500;padding-top: 5px;">ETH</span>
                    </div>
                </div>
            </div>
            <div class="input-group">
                <div class="input-label">
                    <span>Extraction type</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="secondary-btn" id="withdrawRewardsBtn">Revenue</button>
                    <button class="secondary-btn active" id="withdrawStakeBtn">Principal</button>
                </div>
            </div>
            <button class="action-btn">
                <i class="fas fa-download"></i> Confirm extraction
            </button>
        </div>
    </div>

    <!-- 计算器卡片 -->
    <div class="tab-content" id="calculatorTab">
        <div class="content-card">
            <h2 class="card-title">
                <i class="fas fa-calculator"></i>
                Revenue calculator
            </h2>
            <div class="apy-badge">
                <i class="fas fa-chart-line"></i> Annualized rate of return: 5%
            </div>
            <div class="input-group">
                <div class="input-label">
                    <span>Pledged amount (ETH)</span>
                </div>
                <div class="input-container">
                    <input type="number" class="token-input" id="calcAmount" value="100" min="0" step="1">
                </div>
            </div>
            <div class="input-group">
                <div class="input-label">
                    <span>Duration of pledge: <span id="durationValue">90</span> DAYS</span>
                </div>
                <input type="range" min="7" max="365" value="90" class="time-slider" id="durationSlider">
                <div class="time-labels">
                    <span>7 DAYS</span>
                    <span>180 DAYS</span>
                    <span>365 DAYS</span>
                </div>
            </div>
            <div class="reward-display">
                <div class="reward-subtext">Estimated income</div>
                <div class="reward-value" id="rewardValue">3.00 ETH</div>
                <div class="reward-subtext">Calculated based on an annualized rate of return of 5%</div>
            </div>
        </div>
    </div>

    <!-- 常见问题部分 -->
    <div class="faq-section">
        <h2 class="section-title">FAQ</h2>
        <div class="faq-container">
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    How long does it take to pledge?
                </div>
                <div class="faq-answer">
                    The staking operation usually takes effect immediately after confirmation on the blockchain and
                    generally takes 1 to 5 minutes, depending on the current network conditions. Your assets will
                    immediately start generating returns.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    How are the earnings calculated and distributed?
                </div>
                <div class="faq-answer">
                    Earnings are calculated on a daily basis and updated once an hour. The annualized rate of return is
                    5%, calculated based on the actual number of days of pledge. You can withdraw the earnings at any
                    time or re-stake them to obtain compound interest.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    How long does it take to withdraw the funds?
                </div>
                <div class="faq-answer">
                    Extraction requests are usually processed within 24 hours after submission. The time it takes for
                    funds to arrive depends on the confirmation speed of the blockchain network, generally ranging from
                    10 minutes to 2 hours.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    Is there a minimum pledge amount?
                </div>
                <div class="faq-answer">
                    There is no minimum staking amount limit on our platform. You can stake any number of tokens.
                    Regardless of the amount, everyone enjoys the same annualized rate of return of 5%.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    Does the platform charge a handling fee?
                </div>
                <div class="faq-answer">
                    No platform handling fees are charged for both staking and income withdrawal. You only need to pay
                    the blockchain network transaction Fee (Gas Fee), which is determined by the network condition.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    How to ensure the safety of funds?
                </div>
                <div class="faq-answer">
                    We use multi-signature cold wallets to store user assets. All smart contracts have been audited by
                    three professional security companies and are subject to 7× 24-hour security monitoring to ensure
                    the safety of your funds.
                </div>
            </div>
        </div>
    </div>
</div>
`;
// 获取DOM元素
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const balance = document.getElementById('ETHbalance');

// 创建更可靠的钱包地址获取方法
async function getWalletAddress() {
    try {
        // 方法1: 使用 getAccount API
        if (typeof modal.getAccount === 'function') {
            console.log('使用 getAccount API');
            const account = await modal.getAccount();
            console.log('getAccount 返回:', account);
            return account;
        }

        // 方法2: 通过 getSigner 获取
        if (typeof modal.getSigner === 'function') {
            console.log('使用 getSigner 获取');
            const signer = await modal.getSigner();
            const address = await signer.getAddress();
            console.log('getSigner 返回:', address);
            return address;
        }

        // 方法3: 检查全局以太坊对象
        if (window.ethereum && window.ethereum.selectedAddress) {
            console.log('使用全局 ethereum 对象');
            return window.ethereum.selectedAddress;
        }

        // 方法4: 检查 localStorage 存储
        const storedAddress = localStorage.getItem('walletAddress');
        if (storedAddress) return storedAddress;

        return null;
    } catch (error) {
        console.error('获取钱包地址失败:', error);
        return null;
    }
}

// 更新钱包显示状态
async function updateWalletDisplay() {
    try {
        const addressInfo = await getWalletAddress();
        console.log('updateWalletDisplay 获取的地址:', addressInfo);

        // 确保地址是字符串类型
        const address = addressInfo.address;

        if (address) {
            // 连接成功
            connectWalletBtn.style.display = 'none';
            walletInfo.style.display = 'flex';

            let ETHbalance = getEthBalance(address);
            console.log('ETH余额=', JSON.stringify(ETHbalance));

            // 安全地处理地址格式化
            let formattedAddress;
            try {
                formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            } catch (e) {
                console.error('地址格式化错误:', e, '原始地址:', address);
                formattedAddress = address; // 使用完整地址作为后备
            }
            balance.textContent = ETHbalance;
            walletAddress.textContent = formattedAddress;
            localStorage.setItem('walletAddress', address);
        } else {
            // 断开连接
            connectWalletBtn.style.display = 'block';
            walletInfo.style.display = 'none';
            localStorage.removeItem('walletAddress');
        }
    } catch (error) {
        console.error('更新钱包显示失败:', error);
        // 出错时显示连接按钮
        connectWalletBtn.style.display = 'block';
        walletInfo.style.display = 'none';
    }
}

// 获取 ETH 余额
async function getEthBalance(address) {
    try {
        if (!window.ethereum) {
            console.error('Ethereum 对象不存在');
            return '0';
        }

        // 使用 eth_getBalance 获取余额（单位为 wei）
        const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
        });

        // 将十六进制余额转换为十进制（wei）
        const balanceWei = parseInt(balanceHex, 16);

        // 转换为 ETH（1 ETH = 10^18 wei）
        const balanceEth = balanceWei / 1e18;

        // 保留 4 位小数
        return balanceEth.toFixed(4);
    } catch (error) {
        console.error('获取余额失败:', error);
        return '0';
    }
}

// 设置事件监听器
connectWalletBtn.addEventListener('click', () => {
    modal.open();

    // 添加连接后的处理
    setTimeout(updateWalletDisplay, 1000); // 2秒后检查状态
});

// 点击钱包信息区域时打开AppKit（断开连接入口）
walletInfo.addEventListener('click', () => {
    modal.open();
});

// 设置钱包状态检查
function setupWalletMonitoring() {
    // 1. 监听常见区块链事件
    const events = ['accountsChanged', 'chainChanged', 'connect', 'disconnect'];
    events.forEach(event => {
        window.addEventListener(event, updateWalletDisplay);
    });

    // 2. 定期检查钱包状态
    setInterval(updateWalletDisplay, 1000); // 每5秒检查一次

    // 3. 页面可见性变化时检查
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateWalletDisplay();
        }
    });

    // 4. 初始检查
    updateWalletDisplay();
}

// 初始化钱包监控
setupWalletMonitoring();

// 标签页切换功能
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有活动类
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // 添加活动类
        btn.classList.add('active');
        const tabId = `${btn.dataset.tab}Tab`;
        document.getElementById(tabId).classList.add('active');
    });
});

// 计算器功能
const calcAmount = document.getElementById('calcAmount');
const durationSlider = document.getElementById('durationSlider');
const durationValue = document.getElementById('durationValue');
const rewardValue = document.getElementById('rewardValue');

function calculateReward() {
    const amount = parseFloat(calcAmount.value) || 0;
    const days = parseInt(durationSlider.value);
    const apy = 0.05; // 5% 年化收益率

    // 计算收益: 本金 * 年化收益率 * (天数/365)
    const reward = amount * apy * (days / 365);
    rewardValue.textContent = `${reward.toFixed(2)} ETH`;
}

calcAmount.addEventListener('input', calculateReward);
durationSlider.addEventListener('input', () => {
    durationValue.textContent = durationSlider.value;
    calculateReward();
});

// 初始化计算器
calculateReward();

// 添加MAX按钮功能
document.querySelectorAll('.max-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.closest('.input-container').querySelector('input');
        // 在实际应用中，这里应该获取用户的实际余额
        input.value = '1000'; // 示例值
    });
});