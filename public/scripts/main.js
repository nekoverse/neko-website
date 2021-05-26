const abi = [
  "function mint(address buyer, string calldata metadataHash) external payable",
  "function getCurrentPrice() public view returns (uint256)",
  "function isValid(string calldata metadata) external view returns (bool)",
]

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";


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

const onboarding = new MetaMaskOnboarding();

//
// Show/Hide 
//

function showLoading() {  
  $('#loading').removeClass('d-none');
}

function hideLoading() {
  $('#loading').addClass('d-none'); 
}

function showBuyButton() {  
  $('#buyNekoBox').removeClass('d-none');
  hideLoading();
}

function hideBuyButton() {
  $('#buyNekoBox').addClass('d-none');   
}

function showInstallMetaMaskMessage() {  
  $('#installMetamaskBox').removeClass('d-none');
  hideLoading();
}

function hideInstallMetaMaskMessage() {
  $('#installMetamaskBox').addClass('d-none');     
}

function showSwitchNetworkMessage() {  
  $('#switchNetworkBox').removeClass('d-none');
  hideLoading();
}

function hideHideSwitchNetworkMessage() {
  $('#switchNetworkBox').addClass('d-none');   
}

function showWalletAccountMessage() {  
  $('#connectWalletBox').removeClass('d-none');
  hideLoading();
}

function hideWalletAccountMessage() {
  $('#connectWalletBox').addClass('d-none');   
}

//
// Post request handlers
//

function handleChainChanged(chainId) {
  window.location.reload();    
}

function handleAccountsChanged(accounts) {  
  if (accounts.length === 0) {     
    hideBuyButton();   
    showWalletAccountMessage();    
    console.log("No accounts available");
  } else if (accounts[0] !== signer.getAddress()) {              
    signer = provider.getSigner(accounts[0]); 
    hideWalletAccountMessage();     
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
        hideWalletAccountMessage();
        showBuyButton();
      }
    });  
  if (chainId != AVALANCHE_MAINNET_PARAMS.chainId 
    && chainId != AVALANCHE_TESTNET_PARAMS.chainId) {        
    showSwitchNetworkMessage();
  } else {
    hideHideSwitchNetworkMessage(); 
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

function buyNeko() {
  console.log(contract);  
}

function initialize() {      
  if (window.ethereum !== undefined) {    
    ethereum.on('connect', handleConnect);
    ethereum.on('disconnect', handleDisconnect);
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);
  }
  detectEthereumProvider().then(eth => {
    if (eth) {
      if (eth !== window.ethereum) {
        console.error("Do you have multiple wallets?");        
      }
      console.log("Starting the app");

      provider = new ethers.providers.Web3Provider(eth);    
      contract = new ethers.Contract(contractAddress, abi, provider);    
      signer = provider.getSigner(0);             
      // ethereum.request({method: 'eth_accounts'})
      //   .then(accounts => currentAccount = accounts[0])
    } else {
      console.log("Install MetaMask");
      showInstallMetaMaskMessage();      
    }  
  });  



  $('button.install').click(installMetaMask);
  $('button.switch').click(switchNetwork);
  $('button.connect').click(connectAccount);
  $('#buy-button').click(buyNeko);
  $('#add-link').click(addNeko);
}

$(document).ready(initialize)
