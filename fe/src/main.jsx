import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './wagmi.config'
import { StakingApp } from './StakingApp'
import '/src/style/style.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <StakingApp />
    </WagmiProvider>
  </React.StrictMode>
)