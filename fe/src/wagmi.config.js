import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(), // 或你的本地节点URL
  },
  connectors: [
    walletConnect({
      projectId: 'bc8f2a1b3cd268f8295dd93917c4173a',
    })
  ]
});

export { wagmiConfig }


