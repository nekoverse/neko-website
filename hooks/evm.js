import { useWeb3React } from '@web3-react/core'
import { AVALANCHE_LOTTO, AVALANCHE_NEKO, AVALANCHE_SHOP, LOTTO_ABI, NEKO_ABI, SHOP_ABI } from '../lib/evm'

export function useContracts() {
  const { chainId } = useWeb3React()
  // TODO: return fuji values if chainId matches fuji
  return ({
    neko: AVALANCHE_NEKO,
    shop: AVALANCHE_SHOP,
    lotto: AVALANCHE_LOTTO
  })
}

export function useABIs(){
  const { chainId } = useWeb3React()
  // TODO: return fuji values if chainId matches fuji
  return [
    [AVALANCHE_LOTTO, LOTTO_ABI],
    [AVALANCHE_SHOP, SHOP_ABI],
    [AVALANCHE_NEKO, NEKO_ABI]
  ]
}