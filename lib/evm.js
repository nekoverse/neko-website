import { ethers } from "ethers";

import { InjectedConnector } from '@web3-react/injected-connector'

export const AVALANCHE_NEKO = "0xD9702F5E3b0eb7452967CB82529776D672bdC03F";
export const AVALANCHE_SHOP = "0xcA379Ca1c47dD5dEa5dAA331529E4eC1Cf0c32E0";
export const AVALANCHE_LOTTO = "0x73F1E988f6B3f7Cb64986fBcCF4F1a99E740274c";
export const AVALANCHE_ULTRA_64 = "0x12076DC5B313dae2DC3F51832096EdCcc561f002";
export const AVALANCHE_AUCTION = "0xE18859b9745D10A6d319DBF40ee69B85dCD05659";

export const FUJI_NEKO = "0x3a5e1eC94944F37d30ae4e598FC5Ea12164EF09a";
export const FUJI_SHOP = "0x587323C54d71A03bBCce4B914ace0bC6f39c5Ab5";
export const FUJI_LOTTO = "0xDD98e7fCAa7d9a01F0d18a026aEfd3D42414ec0D";
export const FUJI_ULTRA_64 = "0x19Ae66951d70ab49378Edb16412d7d1c46E66A95";
export const FUJI_AUCTION = "0xb0d947Fc227Fe668b99644AE287CE02A97DC1303";

export const SHOP_ABI = [
  "function buy() external payable",
]

export const LOTTO_ABI = [
  "function buyIn(uint256) external",
  "function depositOf(address) external view returns (uint256)",
  "function maxAmount() external view returns (uint256)",
  "function totalAmount() external view returns (uint256)",
  "function playerCount() external view returns (uint256)",
  "function drawNo() external view returns (uint256)"
]

export const NEKO_ABI = [
  "function approve(address, uint256) returns (bool)",
  "function allowance(address, address) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
]

export const ULTRA_64_ABI  = [
  "function balanceOf(address) external view returns (uint)",
  "function assignedToken(address) external view returns (uint)"
];

export const AUCTION_ABI = [
  "function collect(uint) external",
  "function bidTopUp(uint) external payable",
  "function withdraw() external",
  "function highestBidOn(uint) external view returns (uint)",
  "function bidOf(address, uint) external view returns (uint)",
  "function winnerOf(uint) external view returns (address)"
]

export const AVALANCHE_CHAIN_ID = 43114;
export const FUJI_CHAIN_ID = 43113;

export function validChainId(chainId){
  return (chainId === AVALANCHE_CHAIN_ID) || (chainId === FUJI_CHAIN_ID)
}

export const Networks = {
  Avalanche: AVALANCHE_CHAIN_ID,
  Fuji: FUJI_CHAIN_ID
}

export function formatNeko(value) {
  return (value.toString() / (10 ** 8))
}

export function formatAvax(value) {
  return ethers.utils.formatUnits(value, "ether")
}

export function formatNekoBillions(value) {
  return formatNeko(value) / 10 ** 9
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    Networks.Avalanche,// Avalanche
    Networks.Fuji
  ]
})