const abi = [
  "function buy() external payable",
]

const shopAddr = "0xcA379Ca1c47dD5dEa5dAA331529E4eC1Cf0c32E0";


const AVALANCHE_MAINNET_PARAMS = {
    chainId: '0xa86a', //'43114',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network/']
}

const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xa869',//'43113',
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/']
}

let currentChainId;
let provider;
let contract;
let signer;
let shop;

const onboarding = new MetaMaskOnboarding();

//
// Show/Hide 
//

function showGettingNekos() {  
  hideAll();
  $('#buying').removeClass('d-none');
}

function showLoading() {  
  hideAll();
  $('#loading').removeClass('d-none');
}

function showBuyButton(success) {  
  hideAll();
  $('#buyNekoBox').removeClass('d-none');
  if (success !== undefined) {
    if (success) {
      $("#buyNekoBox .btn-group").effect("shake", {direction: "up", distance: 5});
    } else {
      $("#buyNekoBox .btn-group").effect("shake", {direction: "left", distance: 5});
    }
  }
}

function showInstallMetaMaskMessage() {  
  hideAll();
  $('#installMetamaskBox').removeClass('d-none');  
}

function showSwitchNetworkMessage() {  
  hideAll();
  $('#switchNetworkBox').removeClass('d-none');  
}

function showWalletAccountMessage() {  
  hideAll();
  $('#connectWalletBox').removeClass('d-none');  
}

function hideAll() {
  $('#connectWalletBox').addClass('d-none');     
  $('#switchNetworkBox').addClass('d-none');   
  $('#installMetamaskBox').addClass('d-none');     
  $('#buyNekoBox').addClass('d-none');   
  $('#loading').addClass('d-none'); 
  $('#buying').addClass('d-none');
}

//
// Post request handlers
//

function handleChainChanged(chainId) {
  window.location.reload();    
}

function handleAccountsChanged(accounts) {  
  if (accounts.length === 0) {         
    showWalletAccountMessage();    
    console.log("No accounts available");
  } else if (accounts[0] !== signer.getAddress()) {              
    signer = provider.getSigner(accounts[0]);     
    showBuyButton(); 
    console.log("Account changed to", accounts[0]);
  } else {
    console.error("This shouldn't happen", accounts);
  }
}

function handleConnect(connectInfo) {  
  console.log('Connected', connectInfo);
  chainId = connectInfo.chainId;    
  ethereum.request({ method: 'eth_accounts'})
    .then(accounts => {  
      if (accounts.length === 0 && chainId == AVALANCHE_MAINNET_PARAMS.chainId) {
        console.log("Account not connected");
        showWalletAccountMessage();       
      } else if (chainId != AVALANCHE_MAINNET_PARAMS.chainId) {
        showSwitchNetworkMessage();        
      } else {
        console.log("Metamask connected");        
        showBuyButton();
      }
    });  
  if (chainId != AVALANCHE_MAINNET_PARAMS.chainId) {        
    showSwitchNetworkMessage();
  } 
}

function handleDisconnect(error) {  
  console.error('Disconnected', error);
  window.location.reload()
}

//
// Web3 actions
//

function switchNetwork() {
  ethereum
    .request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_MAINNET_PARAMS]
    })
    .then(handleChainChanged) 
    .catch((error) => {
        console.log(error)
    });    
}

function installMetaMask() {
  // window.location.href = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
  console.log("Starting onboarding")
  onboarding.startOnboarding();  
}

function connectAccount() { 
  ethereum    
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)    
    .catch(err => {
      if (err.code === 4001) {
        showWalletAccountMessage();
      } else {
        console.error(err);
      }
    });            
}

function addNeko() {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: "0xD9702F5E3b0eb7452967CB82529776D672bdC03F", // The address that the token is at.
          symbol: "NEKO", // A ticker symbol or shorthand, up to 5 chars.
          decimals: "8", // The number of decimals in the token
          image: "", // A string url of the token logo
        },
      },
    })
    .then(wasAdded => {
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    })
  } catch (error) {
    console.log(error);
  }  
}

function buyNeko(amount) {     
  const rawAmount = this.dataset.amount;
  if (rawAmount == '0.08' || rawAmount == '0.8' || rawAmount == '8.0') {
    const amount = ethers.utils.parseUnits(rawAmount, 'ether');    
    shop.buy({value: amount, gasLimit: 250000})
      .then(tx => {
        console.log("transaction submitted");
        showGettingNekos();
        return tx.wait();
      })
      .then(res => {
        console.log("transaction success");
        showBuyButton(true);         
      })
      .catch(err => {
        console.error("something is wrong")        
        showBuyButton(false);    
      })
  } else {
    console.error('unexpected amount:', rawAmount);    
  }
}

function initialize() {      
  detectEthereumProvider().then(eth => {
    if (eth) {
      if (eth !== window.ethereum) {
        console.error("Do you have multiple wallets?");        
      }
      console.log("Starting the app");

      provider = new ethers.providers.Web3Provider(eth);          
      signer = provider.getSigner(0);       
      shop = new ethers.Contract(shopAddr, abi, signer);      
    } else {
      console.log("Install MetaMask");
      showInstallMetaMaskMessage();      
    }  
  });  

  $('button.install').click(installMetaMask);
  $('button.switch').click(switchNetwork);
  $('button.connect').click(connectAccount);
  $('button.buy').click(buyNeko);
  $('#add-link').click(addNeko);
}

if (window.ethereum !== undefined) { 
  console.log("Registering event handlers");
  ethereum.on('connect', handleConnect);
  ethereum.on('disconnect', handleDisconnect);
  ethereum.on('chainChanged', handleChainChanged);
  ethereum.on('accountsChanged', handleAccountsChanged);
}

$(document).ready(initialize)
