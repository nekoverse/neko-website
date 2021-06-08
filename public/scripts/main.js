const shopAbi = [
  "function buy() external payable",
]

const lottoAbi = [
  "function buyIn(uint256) external",
  "function depositOf(address) external view returns (uint256)",
  "function maxAmount() external view returns (uint256)",
  "function totalAmount() external view returns (uint256)",
  "function playerCount() external view returns (uint256)",
  "function drawNo() external view returns (uint256)"
]

const nekoAbi = [
  "function approve(address, uint256) returns (bool)", 
  "function allowance(address, address) returns (uint256)" 
]

// Mainnet
const nekoAddr = "0xD9702F5E3b0eb7452967CB82529776D672bdC03F";
const shopAddr = "0xcA379Ca1c47dD5dEa5dAA331529E4eC1Cf0c32E0";
const lottoAddr = "0x73F1E988f6B3f7Cb64986fBcCF4F1a99E740274c";

// Fuji addresses
// const nekoAddr = "0x3a5e1eC94944F37d30ae4e598FC5Ea12164EF09a";
// const shopAddr = "0x587323C54d71A03bBCce4B914ace0bC6f39c5Ab5";
// const lottoAddr = "0xDD98e7fCAa7d9a01F0d18a026aEfd3D42414ec0D";


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

const ACTION_GROUP_1 = {
  connect: '#connectWalletBox1',
  install: '#installMetamaskBox1',
  switch: '#switchNetworkBox1',
  buying: '#buyin1g',
  loading: '#loading1',
  list: [
    '#buyNekoBox', 
    '#installMetamaskBox1', 
    '#switchNetworkBox1',    
    '#connectWalletBox1',
    '#loading1',
    '#buying1'
  ]
}

const ACTION_GROUP_2 = {
  connect: '#connectWalletBox2',
  install: '#installMetamaskBox2',
  switch: '#switchNetworkBox2',
  buying: '#buying2',
  loading: '#loading2',  
  alreadyBought: '#alreadyBought',
  lottoStatus: '#lottoStatus',
  list: [
    '#buyLottoTicket', 
    '#installMetamaskBox2', 
    '#switchNetworkBox2',    
    '#connectWalletBox2',
    '#loading2',
    '#buying2',
    '#alreadyBought',
    '#lottoStatus'
  ]
}

let currentChainId;
let provider;
let contract;
let signer;
let shop;
let lotto;
let neko;

const lottoState = {
    lastDrawNo: -1,
    drawNo: -1,
    entries: -1,
    totalSoFar: -1 * 10**9,
    maxDeposit: - 1 * 10**9
}

const onboarding = new MetaMaskOnboarding();


//
// Show/Hide 
//

function showGettingNekos() {  
  hideAll(ACTION_GROUP_1.list);
  $(group.buying).removeClass('d-none');
}

function showLoading(group) {  
  hideAll(group.list);
  $(group.loading).removeClass('d-none');
}

function showBuyButton(success) {  
  hideAll(ACTION_GROUP_1.list);
  $('#buyNekoBox').removeClass('d-none');
  if (success !== undefined) {
    if (success) {
      $("#buyNekoBox .btn-group").effect("shake", {direction: "up", distance: 5});
    } else {
      $("#buyNekoBox .btn-group").effect("shake", {direction: "left", distance: 5});
    }
  }
}

function showBuyLottoButton(success) {  
  hideAll(ACTION_GROUP_2.list, "#lottoStatus");
  $('#buyLottoTicket').removeClass('d-none');
  if (success !== undefined) {
    if (success) {
      $("#buyLottoTicket .btn-group").effect("shake", {direction: "up", distance: 5});
    } else {
      $("#buyLottoTicket .btn-group").effect("shake", {direction: "left", distance: 5});
    }
  }
}


function showEntryStatus(myStake) {  
  hideAll(ACTION_GROUP_2.list, "#lottoStatus");
  $('#myStake').text(String(myStake / 10**9 / 10**8) + "B");
  $('#alreadyBought').removeClass('d-none');
}

function showLottoBoard(myStake) {      
  $('#lottoStatus').removeClass('d-none');
}

function showInstallMetaMaskMessage(group) {  
  hideAll(group.list);
  $(group.install).removeClass('d-none');    
}

function showSwitchNetworkMessage(group) {  
  hideAll(group.list);
  $(group.switch).removeClass('d-none');    
}

function showWalletAccountMessage(group) {  
  hideAll(group.list);
  $(group.connect).removeClass('d-none');    
}

function hideAll(group, except) {
  if (group !== undefined) {
    for (const sel of group) {
      if (sel == except) continue;
      $(sel).addClass('d-none');
    }
  }
}

//
// Post request handlers
//

function handleChainChanged(chainId) {
  window.location.reload();    
}

function handleAccountsChanged(accounts) {  
  if (accounts.length === 0) {         
    showWalletAccountMessage(ACTION_GROUP_1);    
    showWalletAccountMessage(ACTION_GROUP_2);    
    console.log("No accounts available");
  } else {    
    let signerAddr;
    signer.getAddress()
      .then(addr => {      
        if (accounts[0] !== addr) {   
          signer = provider.getSigner(accounts[0]);    
          const amt = ethers.utils.parseUnits('100000000000000', 'ether');    
          signerAddr = addr;  
          showLoading(ACTION_GROUP_2);    
          return neko.approve(lottoAddr, amt);
        } else {
          throw new Error("This shouldn't happen", accounts)          
        }                  
      })
      .then(tx => {                       
        console.log("Approval transaction submitted");
        return tx.wait();      
      })
      .then(res => {
        console.log("Approval transaction success");   
        showBuyButton();   
        showLottoBoard();     
        console.log("Account changed to", accounts[0]);              
      })         
      .then(() => {
        console.log(signerAddr);
        return lotto.depositOf(signerAddr)
      })
      .then(deposit => {      
        myStake = deposit.toString();          
        if (myStake > 0) {      
          showEntryStatus(myStake);  
        } else {
          showBuyLottoButton();  
        }           
      })
      .catch(err => {
        console.error(err);
      })                 
  }
}

function handleConnect(connectInfo) {  
  console.log('Connected', connectInfo);
  chainId = connectInfo.chainId;    
  ethereum.request({ method: 'eth_accounts'})
    .then(accounts => {  
      if (accounts.length === 0 && chainId == AVALANCHE_MAINNET_PARAMS.chainId) {        
        showWalletAccountMessage(ACTION_GROUP_1);    
        showWalletAccountMessage(ACTION_GROUP_2); 
        throw new Error("Account not connected");      
      } else if (chainId != AVALANCHE_MAINNET_PARAMS.chainId) {
        showSwitchNetworkMessage(ACTION_GROUP_1);
        showSwitchNetworkMessage(ACTION_GROUP_2);     
        throw new Error("Wrong network connected");
      } else {
        console.log("Metamask connected");        
        showBuyButton();                
        showLottoBoard();   
        pollLottoState();       
        refreshLottoStateBoard();                   
      }
      return accounts[0];
    })
    .then(addr => lotto.depositOf(addr))
    .then(deposit => {      
      myStake = deposit.toString();      
      console.log(myStake);
      if (myStake > 0) {      
        showEntryStatus(myStake);  
      } else {
        showBuyLottoButton();  
      }           
    })
    .catch(err => {
      console.error(err);
    })  
  if (chainId != AVALANCHE_MAINNET_PARAMS.chainId) {        
    showSwitchNetworkMessage(ACTION_GROUP_1);
    showSwitchNetworkMessage(ACTION_GROUP_2);
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
    //.then(handleAccountsChanged)    
    .catch(err => {
      if (err.code === 4001) {
        showWalletAccountMessage(ACTION_GROUP_1);    
        showWalletAccountMessage(ACTION_GROUP_2);    
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

function getMyStake() {
  let res;
  signer.getAddress()
    .then(addr => lotto.depositOf(addr))
    .then(deposit => {      
      res = deposit.toString();
    })
  return res;
}

function buyLotto() {  
  const amountRaw = $("input.buyLotto").val();  
  const amountScaled = amountRaw * 10**9;    
  const amountStr = String(amountScaled) + "00000000";
  const amount = ethers.BigNumber.from(amountStr);
  lotto.buyIn(amount)
    .then(tx => {
      console.log("BuyIn transaction submitted");      
      return tx.wait();
    })
    .then(res => {
      console.log("BuyIn transaction success");
      showEntryStatus(amount);         
    })
    .catch(err => {
      console.error(err);
      showBuyLottoButton(false);    
    })
  console.log("buying lotto", amount.toString())
}

function buyNeko(amount) {     
  const rawAmount = this.dataset.amount;
  if (rawAmount == '0.08' || rawAmount == '0.8' || rawAmount == '8.0') {
    const amount = ethers.utils.parseUnits(rawAmount, 'ether');    
    shop.buy({value: amount, gasLimit: 250000})
      .then(tx => {
        console.log("Buy transaction submitted");
        showGettingNekos();
        return tx.wait();
      })
      .then(res => {
        console.log("Buy transaction success");
        showBuyButton(true);         
      })
      .catch(err => {
        console.error(err);
        showBuyButton(false);    
      })
  } else {
    console.error('Unexpected amount:', rawAmount);    
  }
}

function pollLottoState() {
  lotto.drawNo().then(n => lottoState.drawNo = n);
  lotto.playerCount().then(n => lottoState.entries = n);
  lotto.maxAmount().then(n => lottoState.maxDeposit = n);
  lotto.totalAmount().then(n => lottoState.totalSoFar = n);  
  setTimeout(pollLottoState, 1000);    
}

function refreshLottoStateBoard() { 
  if (lottoState.totalSoFar == 0) {
    showBuyLottoButton();
  } 
  $('#drawNo').text(String(lottoState.drawNo));
  $('#entries').text(String(lottoState.entries));
  $('#totalSoFar').text(String(lottoState.totalSoFar / 10**9 / 10**8) + "B");
  $('#maxDeposit').text(String(lottoState.maxDeposit / 10**9 / 10**8) + "B");
  setTimeout(refreshLottoStateBoard, 1000);   
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
      shop = new ethers.Contract(shopAddr, shopAbi, signer);
      lotto = new ethers.Contract(lottoAddr, lottoAbi, signer);
      neko = new ethers.Contract(nekoAddr, nekoAbi, signer);   
    } else {
      console.log("Install MetaMask");
      showInstallMetaMaskMessage(ACTION_GROUP_1);      
      showInstallMetaMaskMessage(ACTION_GROUP_2);      
    }  
  });    

  $('button.install').click(installMetaMask);
  $('button.switch').click(switchNetwork);
  $('button.connect').click(connectAccount);
  $('button.buy').click(buyNeko);
  $('button.buyLotto').click(buyLotto);  
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
