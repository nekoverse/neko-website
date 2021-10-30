export const AVALANCHE_NEKO = "0xD9702F5E3b0eb7452967CB82529776D672bdC03F";
export const AVALANCHE_SHOP = "0xcA379Ca1c47dD5dEa5dAA331529E4eC1Cf0c32E0";
export const AVALANCHE_LOTTO = "0x73F1E988f6B3f7Cb64986fBcCF4F1a99E740274c";

export const FUJI_NEKO = "0x3a5e1eC94944F37d30ae4e598FC5Ea12164EF09a";
export const FUJI_SHOP = "0x587323C54d71A03bBCce4B914ace0bC6f39c5Ab5";
export const FUJI_LOTTO = "0xDD98e7fCAa7d9a01F0d18a026aEfd3D42414ec0D";

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
  "function allowance(address, address) returns (uint256)"
]