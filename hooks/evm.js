import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import {
  AVALANCHE_LOTTO, AVALANCHE_NEKO, AVALANCHE_SHOP,
  FUJI_NEKO, FUJI_SHOP, FUJI_LOTTO,
  LOTTO_ABI, NEKO_ABI, SHOP_ABI,
  AVALANCHE_CHAIN_ID, FUJI_CHAIN_ID
} from '../lib/evm'

const AVALANCHE_ADDRESSES = {
  neko: AVALANCHE_NEKO,
  shop: AVALANCHE_SHOP,
  lotto: AVALANCHE_LOTTO
}

const FUJI_ADDRESSES = {
  neko: FUJI_NEKO,
  shop: FUJI_SHOP,
  lotto: FUJI_LOTTO
}

export function useContractAddresses() {
  const { chainId } = useWeb3React()
  return (
    (chainId === AVALANCHE_CHAIN_ID) ? (
      AVALANCHE_ADDRESSES
    ) : (
      (chainId === FUJI_CHAIN_ID) ? (
        FUJI_ADDRESSES
      ) : (
        {}
      )
    ))
}

const AVALANCHE_ABIS = [
  [AVALANCHE_LOTTO, LOTTO_ABI],
  [AVALANCHE_SHOP, SHOP_ABI],
  [AVALANCHE_NEKO, NEKO_ABI]
]

const FUJI_ABIS = [
  [FUJI_LOTTO, LOTTO_ABI],
  [FUJI_SHOP, SHOP_ABI],
  [FUJI_NEKO, NEKO_ABI]
]

export function useABIs() {
  const { chainId } = useWeb3React()
  // TODO: return fuji values if chainId matches fuji
  return (
    (chainId === AVALANCHE_CHAIN_ID) ? (
      AVALANCHE_ABIS
    ) : (
      (chainId === FUJI_CHAIN_ID) ? (
        FUJI_ABIS
      ) : (
        []
      )
    )
  )
}

const AVALANCHE_ABIS_BY_NAME = {
  lotto: LOTTO_ABI,
  shop: SHOP_ABI,
  neko: NEKO_ABI
}

const FUJI_ABIS_BY_NAME = {
  lotto: LOTTO_ABI,
  shop: SHOP_ABI,
  neko: NEKO_ABI
}

export function useABIsByName() {
  const { chainId } = useWeb3React()
  // TODO: return fuji values if chainId matches fuji
  return (
    (chainId === AVALANCHE_CHAIN_ID) ? (
      AVALANCHE_ABIS_BY_NAME
    ) : (
      (chainId === FUJI_CHAIN_ID) ? (
        FUJI_ABIS_BY_NAME
      ) : (
        []
      )
    )
  )
}

export function useContracts() {
  const { library } = useWeb3React()
  const { shop, lotto, neko} = useContractAddresses()
  const { shop: shopAbi, lotto: lottoAbi, neko: nekoAbi} = useABIsByName()

  const [contracts, setContracts] = useState({})
  useEffect(() => {
    const signer = library && library.getSigner(0)
    if (signer) {
      setContracts({
        shop: new ethers.Contract(shop, shopAbi, signer),
        lotto: new ethers.Contract(lotto, lottoAbi, signer),
        neko: new ethers.Contract(neko, nekoAbi, signer)
      })
    }
  }, [library, shop, shopAbi, lotto, lottoAbi, neko, nekoAbi])
  return contracts
}