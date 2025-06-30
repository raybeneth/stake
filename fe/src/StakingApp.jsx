import React, { useState, useEffect, useRef } from 'react';
import { createAppKit } from '@reown/appkit';
import { etherlink } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { formatEther } from 'ethers';
import { JsonRpcProvider } from 'ethers';
import config from './abi/ETHStaking.json';
import { parseEther } from 'viem';
import { writeContract, readContract } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { wagmiConfig } from './wagmi.config';

export const StakingApp = () => {
  const { address } = useAccount();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  // ETH余额
  const [ethBalance, setEthBalance] = useState('0');
  // ETH总质押金额加收益
  const [total, setTotal] = useState('0');
  // 收益
  const [earnings, setEarnings] = useState('0');
  // 总共可提取金额
  const [canbe, setCanbe] = useState('0');
  const [extractable, setExtractable] = useState('0');
  const [activeTab, setActiveTab] = useState('stake');
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [calcAmount, setCalcAmount] = useState(100);
  const [duration, setDuration] = useState(90);
  const [reward, setReward] = useState('3.00 ETH');
  const [withdrawType, setWithdrawType] = useState('principal');
  
  const modalRef = useRef(null);
  const projectId = 'bc8f2a1b3cd268f8295dd93917c4173a';
  const hardhat = {
    id: 31337,
    name: 'Hardhat',
    network: 'hardhat',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: {
      default: {
        http: ['https://c489-112-10-132-49.ngrok-free.app']
      }
    },
    testnet: true
  };
  const networks = [etherlink, hardhat];
  
  const SUPPORTED_NETWORKS = {
    31337: {
      name: 'Localhost',
      chainId: 31337,
      rpcUrl: 'https://c489-112-10-132-49.ngrok-free.app',
      explorerUrl: 'http://localhost:3000',
      currencySymbol: 'ETH',
      contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    },
    11155111: {
      name: 'Ethereum Mainnet',
      chainId: 11155111,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      explorerUrl: 'https://etherscan.io',
      currencySymbol: 'ETH',
      contractAddress: '0x...'
    }
  };
  
  useEffect(() => {
    // 初始化 AppKit
    const metadata = {
      name: 'AppKit',
      description: 'AppKit Example',
      url: 'http://127.0.0.1:5173',
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    };
    const wagmiAdapter = new WagmiAdapter({
      projectId,
      networks
    });
    const modal = createAppKit({
      adapters: [wagmiAdapter],
      networks: networks,
      metadata,
      projectId,
      features: {
        analytics: false
      }
    });
    modalRef.current = modal;
    setupWalletMonitoring();
    return () => {
      // 清理监听器
      const events = ['accountsChanged', 'chainChanged', 'connect', 'disconnect'];
      events.forEach(event => {
        window.removeEventListener(event, updateWalletDisplay);
      });
    };
  }, []);
  
  useEffect(() => {
    if (address) {
      updateWalletDisplay();
    }
  }, [address]);
  
  useEffect(() => {
    calculateReward();
  }, [calcAmount, duration]);
  
  const getJSONRpcProvider = (chainId) => {
    return new JsonRpcProvider(SUPPORTED_NETWORKS[chainId].rpcUrl);
  };
  
  const updateWalletDisplay = async () => {
    try {
      if (address) {
        setWalletConnected(true);
        const formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        setWalletAddress(formattedAddress);
        
        // 更新钱包余额
        const balance = await getEthBalance(address);
        setEthBalance(`${balance} ETH`);
        localStorage.setItem('walletAddress', address);
        // 更新合约中的质押金额
        const chainId = await modalRef.current.getChainId();
        if (!SUPPORTED_NETWORKS[chainId]) {
          throw new Error(`不支持的链ID: ${chainId}`);
        }
        const contractAddress = SUPPORTED_NETWORKS[chainId].contractAddress;
        // 请求合约数据
        console.log(`请求合约地址: ${contractAddress} with chainId`, chainId, 'and ABI', config.abi, 'and address', address);
        const result = await readContract(wagmiConfig, {
          abi: config.abi,
          address: contractAddress,
          functionName: 'getStakingInfo',
          args: [],
          account: address
        });
        console.log('合约数据:', result);
        setTotal(`${formatEther(result.totalAmount ? result.totalAmount : 0)}`);
        setEarnings(`${formatEther(result.rewardAmount ? result.rewardAmount : 0)}`);
        setCanbe(`${formatEther(result.stakedAmount ? result.stakedAmount : 0)}`);
        setExtractable(`${formatEther(result.totalAmount ? result.totalAmount : 0)}`);
      } else {
        setWalletConnected(false);
        setWalletAddress('');
        setEthBalance('0 ETH');
        localStorage.removeItem('walletAddress');
      }
    } catch (error) {
      console.error('更新钱包显示失败:', error);
      setWalletConnected(false);
    }
  };
  
  const getEthBalance = async (address) => {
    try {
      if (!modalRef.current) return '0';
      
      const chainId = await modalRef.current.getChainId();
      const provider = getJSONRpcProvider(chainId);
      
      if (provider) {
        const balance = await provider.getBalance(address);
        const balanceEth = formatEther(balance);
        return parseFloat(balanceEth).toFixed(4);
      } else {
        return '0';
      }
    } catch (error) {
      console.error('获取余额失败:', error);
      return '0';
    }
  };

  const setupWalletMonitoring = () => {
    // 监听钱包事件
    const events = ['accountsChanged', 'chainChanged', 'connect', 'disconnect'];
    events.forEach(event => {
      window.addEventListener(event, updateWalletDisplay);
    });
    // 初始检查
    updateWalletDisplay();
  };
  
  const connectWallet = async () => {
    try {
      if (modalRef.current) {
        await modalRef.current.open();
        updateWalletDisplay();
      }
    } catch (error) {
      console.error('连接失败:', error);
    }
  };
  
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.open();
    }
  };
  
  const calculateReward = () => {
    const amount = parseFloat(calcAmount) || 0;
    const apy = 0.05;
    const reward = amount * apy * (duration / 365);
    setReward(`${reward.toFixed(2)} ETH`);
  };
  
  const handleMaxStake = () => {
    setStakeAmount('1000');
  };
  
  const handleMaxWithdraw = () => {
    setWithdrawAmount('1000');
  };
  
  const stakeTokens = async () => {
    if (!address) {
      alert('请先连接钱包');
      return;
    }
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的质押数量');
      return;
    }
    try {
      const chainId = await modalRef.current.getChainId();
      if (!SUPPORTED_NETWORKS[chainId]) {
        throw new Error(`不支持的链ID: ${chainId}`);
      }
      
      const contractAddress = SUPPORTED_NETWORKS[chainId].contractAddress;
    
      const amountWei = parseEther(amount.toString());
      
      console.log(`质押金额: ${amount} ETH (${amountWei.toString()} wei) on chain ${chainId} to contract ${contractAddress} with ABI`, config.abi);
      const result = await writeContract(wagmiConfig, {
        abi: config.abi,
        address: contractAddress,
        value: amountWei,
        functionName: 'stake',
        args: []
      });
      
      console.log('交易成功:', result);
      
      // 更新余额显示
      // const newBalance = await getEthBalance(address);
      // setEthBalance(`${newBalance} ETH`);
      updateWalletDisplay();
      
      alert('质押成功！');
      setStakeAmount('');
    } catch (error) {
      console.error('质押失败:', error);
      
      let errorMessage = "交易失败";
      if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "余额不足";
      } else if (error.code === "ACTION_REJECTED") {
        errorMessage = "用户拒绝了交易";
      } else if (error.message.includes("exceeds balance")) {
        errorMessage = "质押金额超过余额";
      } else if (error.message.includes("unsupported chain")) {
        errorMessage = "请切换到支持的区块链网络";
      }
      
      alert(`质押失败: ${errorMessage}`);
    }
  };
  
  return (
    <div>
      {/* 导航栏 */}
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo">ES</div>
          <div className="logo-text">Easy(ETH) Staking</div>
        </div>
        <div className="nav-links">
          <a href="#" className="active">HOME</a>
        </div>
        <div className="wallet-section">
          {!walletConnected ? (
            <button className="connect-btn" onClick={connectWallet}>
              <i className="fas fa-wallet"></i> Connect Wallet
            </button>
          ) : (
            <div className="wallet-info" onClick={openModal}>
              <i className="fas fa-wallet"></i>
              <span>{walletAddress}</span>
            </div>
          )}
        </div>
      </nav>
      <div className="container">
        {/* PC端顶部横幅 */}
        <div className="top-banner">
          <div className="slogan-container">
            <div className="slogan">A safe and efficient token staking solution</div>
            <div className="slogan-subtext">
              Our platform offers an industry-leading annualized rate of return of 5%, ensuring the security of funds
              through blockchain technology and achieving stable asset appreciation.
              Zero transaction fees, real-time returns, and flexible access provide the best value-added solution for
              your digital assets.
            </div>
            <div className="slogan-features">
              <div className="feature-tag">5% annualized return</div>
              <div className="feature-tag">Zero handling fee</div>
              <div className="feature-tag">Real-time revenue</div>
              <div className="feature-tag">Safe and reliable</div>
              <div className="feature-tag">Flexible access</div>
            </div>
          </div>
          <div className="video-container">
            <video className="promo-video" autoPlay loop muted playsInline>
              <source src="/videos/57C1258631DC562B.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        {/* 移动端视频 */}
        <div className="mobile-video-container">
          <video className="promo-video" autoPlay loop muted playsInline>
            <source src="/videos/57C1258631DC562B.mp4" type="video/mp4" />
          </video>
        </div>
        {/* 移动端宣传语 */}
        <div className="mobile-slogan-container">
          <div className="slogan">A safe and efficient token staking solution</div>
          <div className="slogan-subtext" style={{ marginTop: '15px' }}>
            5% annualized return · Zero transaction fees · Real-time returns · Safe and reliable · Flexible access
          </div>
        </div>
        {/* 功能区域标题 */}
        <h2 className="section-title">Token staking service</h2>
        {/* 标签页导航 */}
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'stake' ? 'active' : ''}`} 
            onClick={() => setActiveTab('stake')}
          >
            Easy Staking
          </button>
          <button 
            className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`} 
            onClick={() => setActiveTab('withdraw')}
          >
            Withdrawal
          </button>
          <button 
            className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`} 
            onClick={() => setActiveTab('calculator')}
          >
            Calculation
          </button>
        </div>
        {/* 质押卡片 */}
        {activeTab === 'stake' && (
          <div className="tab-content active" id="stakeTab">
            <div className="content-card">
              <h2 className="card-title">
                <i className="fas fa-lock"></i>
                Staking tokens
              </h2>
              <div className="apy-badge">
                <i className="fas fa-percentage"></i> Annualized rate of return: 5%
              </div>
              <div className="input-group">
                <div className="input-label">
                  <span>Quantity of pledge</span>
                  <span>Balance: <span className="balance">{ethBalance}</span></span>
                </div>
                <div className="input-container">
                  <input 
                    type="number" 
                    id="stakeAmountInput"
                    name="stakeAmount"
                    className="token-input" 
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0" 
                    min="0" 
                    step="0.01"
                  />
                  <div className="input-actions">
                    <button className="max-btn" onClick={handleMaxStake}>MAX</button>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500, paddingTop: '5px' }}>ETH</span>
                  </div>
                </div>
              </div>
              <button className="action-btn" onClick={stakeTokens}>
                <i className="fas fa-lock"></i> STAKING
              </button>
            </div>
          </div>
        )}
        {/* 提款卡片 */}
        {activeTab === 'withdraw' && (
          <div className="tab-content active" id="withdrawTab">
            <div className="content-card">
              <h2 className="card-title">
                <i className="fas fa-coins"></i>
                Withdraw funds
              </h2>
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Total amount of pledge</span>
                  <span className="status-value">{total} ETH</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Earnings to be withdrawn</span>
                  <span className="status-value primary">{earnings} ETH</span>
                </div>
                <div className="status-item">
                  <span className="status-label">The pledge can be withdrawn</span>
                  <span className="status-value">{canbe} ETH</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-label">
                  <span>Extraction quantity</span>
                  <span>Extractable: <span className="balance">{extractable} ETH</span></span>
                </div>
                <div className="input-container">
                  <input 
                    type="number" 
                    id="withdrawAmountInput"
                    name="withdrawAmount"
                    className="token-input" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.0" 
                    min="0" 
                    step="0.01"
                  />
                  <div className="input-actions">
                    <button className="max-btn" onClick={handleMaxWithdraw}>MAX</button>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500, paddingTop: '5px' }}>ETH</span>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <div className="input-label">
                  <span>Extraction type</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className={`secondary-btn ${withdrawType === 'revenue' ? 'active' : ''}`}
                    onClick={() => setWithdrawType('revenue')}
                  >
                    Revenue
                  </button>
                  <button 
                    className={`secondary-btn ${withdrawType === 'principal' ? 'active' : ''}`}
                    onClick={() => setWithdrawType('principal')}
                  >
                    Principal
                  </button>
                </div>
              </div>
              <button className="action-btn">
                <i className="fas fa-download"></i> Confirm extraction
              </button>
            </div>
          </div>
        )}
        {/* 计算器卡片 */}
        {activeTab === 'calculator' && (
          <div className="tab-content active" id="calculatorTab">
            <div className="content-card">
              <h2 className="card-title">
                <i className="fas fa-calculator"></i>
                Revenue calculator
              </h2>
              <div className="apy-badge">
                <i className="fas fa-chart-line"></i> Annualized rate of return: 5%
              </div>
              <div className="input-group">
                <div className="input-label">
                  <span>Pledged amount (ETH)</span>
                </div>
                <div className="input-container">
                  <input 
                    type="number" 
                    id="calcAmountInput"
                    name="calcAmount"
                    className="token-input" 
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    min="0" 
                    step="1"
                  />
                </div>
              </div>
              <div className="input-group">
                <div className="input-label">
                  <span>Duration of pledge: <span id="durationValue">{duration}</span> DAYS</span>
                </div>
                <input 
                  type="range" 
                  id="durationSlider"
                  name="duration"
                  min="7" 
                  max="365" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="time-slider" 
                />
                <div className="time-labels">
                  <span>7 DAYS</span>
                  <span>180 DAYS</span>
                  <span>365 DAYS</span>
                </div>
              </div>
              <div className="reward-display">
                <div className="reward-subtext">Estimated income</div>
                <div className="reward-value">{reward}</div>
                <div className="reward-subtext">Calculated based on an annualized rate of return of 5%</div>
              </div>
            </div>
          </div>
        )}
        {/* 常见问题部分 */}
        <div className="faq-section">
          <h2 className="section-title">FAQ</h2>
          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-question-circle"></i>
                How long does it take to pledge?
              </div>
              <div className="faq-answer">
                The staking operation usually takes effect immediately after confirmation on the blockchain and
                generally takes 1 to 5 minutes, depending on the current network conditions. Your assets will
                immediately start generating returns.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-question-circle"></i>
                How are the earnings calculated and distributed?
              </div>
              <div className="faq-answer">
                Earnings are calculated on a daily basis and updated once an hour. The annualized rate of return is
                5%, calculated based on the actual number of days of pledge. You can withdraw the earnings at any
                time or re-stake them to obtain compound interest.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-question-circle"></i>
                How long does it take to withdraw the funds?
              </div>
              <div className="faq-answer">
                Extraction requests are usually processed within 24 hours after submission. The time it takes for
                funds to arrive depends on the confirmation speed of the blockchain network, generally ranging from
                10 minutes to 2 hours.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-question-circle"></i>
                Is there a minimum pledge amount?
              </div>
              <div className="faq-answer">
                There is no minimum staking amount limit on our platform. You can stake any number of tokens.
                Regardless of the amount, everyone enjoys the same annualized rate of return of 5%.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-question-circle"></i>
                Does the platform charge a handling fee?
              </div>
              <div className="faq-answer">
                No platform handling fees are charged for both staking and income withdrawal. You only need to pay
                the blockchain network transaction Fee (Gas Fee), which is determined by the network condition.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-question-circle"></i>
                How to ensure the safety of funds?
              </div>
              <div className="faq-answer">
                We use multi-signature cold wallets to store user assets. All smart contracts have been audited by
                three professional security companies and are subject to 7× 24-hour security monitoring to ensure
                the safety of your funds.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};