import Head from 'next/head'
import '../styles/globals.css'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { EthSWRConfig } from 'ether-swr'
import { useABIs } from '../hooks/evm'


function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function WalletProvider({ children }) {
  const { chainId, account, library, activate, active } = useWeb3React()
  const ABIs = useABIs()

  return (
    <EthSWRConfig value={{ web3Provider: library, ABIs: new Map(ABIs), refreshInterval: 30000 }}>
      {children}
    </EthSWRConfig>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <Head>
          <title>Nekoverse</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Component {...pageProps} />
      </WalletProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
