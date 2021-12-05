import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import {
  AVALANCHE_LOTTO, AVALANCHE_NEKO, AVALANCHE_SHOP, AVALANCHE_ULTRA_64, AVALANCHE_AUCTION,
  FUJI_NEKO, FUJI_SHOP, FUJI_LOTTO, FUJI_ULTRA_64, FUJI_AUCTION,
  LOTTO_ABI, NEKO_ABI, SHOP_ABI, ULTRA_64_ABI, AUCTION_ABI,
  AVALANCHE_CHAIN_ID, FUJI_CHAIN_ID
} from '../lib/evm'

const AVALANCHE_ADDRESSES = {
  neko: AVALANCHE_NEKO,
  shop: AVALANCHE_SHOP,
  lotto: AVALANCHE_LOTTO,
  auction: AVALANCHE_AUCTION,
  ultra64: AVALANCHE_ULTRA_64
}

const FUJI_ADDRESSES = {
  neko: FUJI_NEKO,
  shop: FUJI_SHOP,
  lotto: FUJI_LOTTO,
  auction: FUJI_AUCTION,
  ultra64: FUJI_ULTRA_64
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
  [AVALANCHE_NEKO, NEKO_ABI],
  [AVALANCHE_ULTRA_64, ULTRA_64_ABI],
  [AVALANCHE_AUCTION, AUCTION_ABI]
]

const FUJI_ABIS = [
  [FUJI_LOTTO, LOTTO_ABI],
  [FUJI_SHOP, SHOP_ABI],
  [FUJI_NEKO, NEKO_ABI],
  [FUJI_ULTRA_64, ULTRA_64_ABI],
  [FUJI_AUCTION, AUCTION_ABI]
]

export function useABIs() {
  const { chainId } = useWeb3React()
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

const ABIS_BY_NAME = {
  lotto: LOTTO_ABI,
  shop: SHOP_ABI,
  neko: NEKO_ABI,
  ultra64: ULTRA_64_ABI,
  auction: AUCTION_ABI,
}

export function useContracts() {
  const { library } = useWeb3React()
  const { shop, lotto, neko, ultra64, auction } = useContractAddresses()
  const {
    shop: shopAbi, lotto: lottoAbi, neko: nekoAbi,
    ultra64: ultra64Abi, auction: auctionAbi
  } = ABIS_BY_NAME

  const [contracts, setContracts] = useState({})
  useEffect(() => {
    const signer = library && library.getSigner(0)
    if (signer) {
      setContracts({
        shop: new ethers.Contract(shop, shopAbi, signer),
        lotto: new ethers.Contract(lotto, lottoAbi, signer),
        neko: new ethers.Contract(neko, nekoAbi, signer),
        ultra64: new ethers.Contract(ultra64, ultra64Abi, signer),
        auction: new ethers.Contract(auction, auctionAbi, signer)
      })
    }
  }, [library, shop, shopAbi, lotto, lottoAbi, neko, nekoAbi])
  return contracts
}