const ultra64Abi  = [
  "function balanceOf(address) external view returns (uint)",
  "function assignedToken(address) external view returns (uint)"
];
const auctionAbi = [
  "function collect(uint) external",
  "function bidTopUp(uint) external payable",
  "function withdraw() external",
  "function highestBidOn(uint) external view returns (uint)",
  "function bidOf(address, uint) external view returns (uint)",
  "function winnerOf(uint) external view returns (address)"
]

// Mainnet
const ultra64Addr = "0x12076DC5B313dae2DC3F51832096EdCcc561f002";
const auctionAddr = "0xE18859b9745D10A6d319DBF40ee69B85dCD05659";

// Fuji addresses
// const ultra64Addr = "0x19Ae66951d70ab49378Edb16412d7d1c46E66A95";
// const auctionAddr = "0xb0d947Fc227Fe668b99644AE287CE02A97DC1303";


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
    withdraw: '#withdrawFundsBox',
    list: [
      '#withdrawFundsBox',
      '#installMetamaskBox1',
      '#switchNetworkBox1',
      '#connectWalletBox1',
    ]
}

const ACTION_GROUP_2 = {
    connect: '#connectWalletBox2',
    install: '#installMetamaskBox2',
    switch: '#switchNetworkBox2',
    mint: '#mintNftBox',
    list: [
      '#mintNftBox',
      '#installMetamaskBox2',
      '#switchNetworkBox2',
      '#connectWalletBox2',
    ]
}

let signer;
let auction;
let ultra64;

let tokensOnSale = [0, 1, 2, 3, 4, 5, 6, 7];
let tokensSold = [
];
let soldPrices = {};
let soldTokenSets = [
  // [0, 1, 2, 3, 4, 5, 6, 7],
  // [8, 9, 10, 11, 12, 13, 14, 15],
  // [16, 17, 18, 19, 20, 21, 22, 23],
  // [24, 25, 26, 27, 28, 29, 30, 31],
  // [32, 33, 34, 35, 36, 37, 38, 39],
  // [40, 41, 42, 43, 44, 45, 46, 47],
  // [48, 49, 50, 51, 52, 53, 54, 55],
  // [56, 57, 58, 59, 60, 61, 62, 63],
]
const tokenImageHashes = [
  "eVP-SktyhZTdscybn8N4bF7SxSeiotMLoXx9ICX0AqI",
  "hGZgIGvBe2xFXKmvJL1pZlHyLasBpbjlakxhpTFSHUg",
  "nz4mdS2ezT56xvfrJS-agSQG4MQ53lo6F0VgMI_hUqQ",
  "5QwrsPr6eTCKyw8Rp1z6piyDGAJZETPi7t4vAOqqXhY",
  "RGW4B8gbrg-5NJIH-1W1ObaxRsZXu9btzVnoG-Pa2ro",
  "yVqU3zZXdk_5OhWtvtepuGMVo2oNw9gjeY70PzdVFPs",
  "pHwazN2WvM8MujV-VSnSTHKzS3zRHFOhPx2OGk-G3Ww",
  "XiKA583lYhGSDn41vFqUX2qnKnIjy9TJCk4iaVA1J7c",
  "n3dY_0ihPMRay4Yde9mJJs3AjWbans9OXKnQgB9jAgc",
  "iSwvVmrh9jSIqOjY6-6CVvrMVAmFhU0PR56kn8FCsPI",
  "6PAIxK7BUhyKYymDdJKH8okCeZeDfzUaLLCLbUO-Hbw",
  "EzMayyLAMuhvbMAnM6MAt_vuqkygj9kz5DrtPQjyJA0",
  "cEkN3-_IRZI2eyMmBSxw2QYju5JmRU0oc0biPuCS3PU",
  "46AWYbyNfFOsqROqElojI4vx8qI7KLtEcbXJUJPeGmc",
  "OZLCnsc_ngsvuULtKZrv52AN3F7BBttzizPHi4UegKc",
  "YV-Co6G97F4fa36P0SEQq7bDGBFfGvKco6fBvrZdQjk",
  "eOeB3AsHjfsVQUw3LcIBHfbWGcmatwKHkEFWPeDs_u4",
  "5Zn6cG9eUEGmzF54y8MGMcO6Pu4fO7jUklGlwghZmBU",
  "buels6mVDosXG64g59xEfleE5UGm0MLGiNcckVa8BNs",
  "9XFWn2F8qpI9b7glV9-Gh2szIxYt_hOF_KuklidCP4E",
  "qzaBRkMa7QJY4Hk0HoQaS_FcKjaJDRFhuyxuDdUvscw",
  "8hBwz_cQYiG65pe55p5KQWF0FVKbQIzAC-wXy1BWHOg",
  "CHbvy-fOtVD-kV1PsVouQcz5gzKQN6_jCk_EDnzb96M",
  "1OebVZIU-jbzR5fiJBuEQDUc2WgEwHRT9bIdSOiVHLM",
  "IoVwCYjBR47DZZkaKkQnxbLoVuhUWarpUN1CtPcUXmU",
  "lxPcL8HY88tAfZsJn0hx32p_Xrjl3jrK-53vJ1QL0Vg",
  "A_-HKvVKoovPbZkUinGN_kzGirjTjZacb6kg-mZC1f4",
  "XMJKGdj9iRbiHUVEXCyLpbsZlvjIoIEDGnEZd9xIT2U",
  "n1iHSHdEvhXF6ni8lNR7S2fes0IlBNN-FDtZ3kDgyUE",
  "GCHwZ1jW6topqr5u0ZrZ0qQ9AV5NUMwzKyJOvFE65wo",
  "qTqHg0L3fyEpL-uWba_TBLUaeQiWZ6P600KraH6txzU",
  "R8k-nzlHJz7iws99DyfwgaaRf4ey_0z5RQ6L-jKcCy0",
  "Vw8sji_BvYNjqeF4J9fBqM23x9Y5wsAOUPHwLeCBh_c",
  "aUUcTIuecf797aAWfzwpFcMQeeM44cWZI7lozcHQ7Ec",
  "ZKbno0E8t21LP5RSGFlVsxzK7Xpxa4yOAjuzHIp1_V4",
  "aTbV53Y4zSAh51brO0H0NUEKF9r4tdSlF7aO5QJvlrE",
  "JZr9f8RVo7LMSm0DQdo7ElY-Jd-NpT3DTyfBxLKU0HQ",
  "lGDRPEscj1r5CZJbPDzZ0KQA-f4DLu5adcVL89OF_oQ",
  "owVwPct8qP1n--RQNhr771P93XmpwTiKuEVpmeL69ok",
  "JYuCII5zcNefqsctL0h-Y7HiR3-Jd8gpUNmNgvl-ozA",
  "icuuvoZ_oqEnUzZR8ZsqUL_N8L28YH1h4LIlEJNl9bo",
  "YuegviyfNi-yQy51a9tzJT12Cw_Lvp2hb7PffJi6MrM",
  "mhp7Wr8iXBLbePeEfQzALK_mKHygEWdc3_MsdsyO7Do",
  "SGmqyO4bC5aALiiUTGz-a4zTj3VXxsCrYUzs54zljKs",
  "9Za1FV48FB1KD1xwunOULqJzudgXeGYM_6Tekiy5E0k",
  "GDhRu55HpxXDFCBtz8e9y8NlaW28mPQTlmeFfA1Ca8c",
  "eeneqcwiBjvr9lfvWZ-P9fhXZt88l5yCVXChytohncs",
  "V2RjXJr8Dp81i7o9OQOQy5TtSwxryPtxtc95EFbI4zA",
  "hlOGLDH3YR4jBEePD6HYGXE_TZua3OkSrl8vpzDa8VM",
  "aPKHHentMHkAjV2gShb-fsaZUyMDZoeZ6Xr7pY3DOtE",
  "6YOyGNIB-QUGCz4q3RODuZqC8JMLlhkgU4DcKCkNfR0",
  "k_bXOK69A--cY_j2Zb6P43XqAbkPJnr9Oqnl-Xf-XTY",
  "XnhYKtSoiI7lBzSHBCBDaI7UC4TivbIMw_7ISwwVBrs",
  "uHWmDDRuW9HdQUOYrFx5RHvmuPZURBta8If_36BaXdU",
  "7818e4NgaGugnlz1GovNgTtzJphtqJ6bFnUrLXEWNWA",
  "il_H4D8fId3Jsc-PeoxDpjGF3gZ7DppaY2CL3_Cxfz8",
  "g9-jEYi8VcGxSqtsTYOsjwDwffwn-8wPyeqrNoMmFSc",
  "FKvSQnva-4h1TAL7XOdyj9lTULTUia0ofGU-1H6I_1g",
  "sX1AqkNPHKlBfXhEEUBbcrGd8J5MK6lZQqv96XztiJU",
  "sqA-svE-zUOr8pxPeVj9Mzx_MAyDMQxYp6rgtxBcqDc",
  "-b67SdgHqe7pKgR6y7qKHhd_l6BIlhwOsO_jBhQ69hQ",
  "RAM3avUaqn2q2rVv9HS8Lw2vMNthmuvP8_4PtqWv4S0",
  "TfpHgXgxi8q0BSINoVTw14ZILaCdFGDIZ7c_Ofh7ejE",
  "lTgT6zl14_-0rdieGCZLJhAKLzVXuWoI9MAU3GiAEWE",
  ]

//
// Show/Hide
//

function hideAll(group, except) {
    if (group !== undefined) {
        for (const sel of group) {
            if (sel == except) continue;
            $(sel).addClass('d-none');
        }
    }
}

function showDetails() {
    $("img", this).show();
    $("div", this).addClass("d-none");
}

function hideDetails() {
    $("img", this).hide();
    $("div", this).removeClass("d-none");
}

function showButton(group, section) {
    hideAll(group.list);
    $(group[section]).removeClass('d-none');
}

function flashColor(elem, from, to) {
  $(elem).removeClass(from);
  $(elem).addClass(to);
}

function showSoldItems() {
  let rowCount = 0;
  for (let tokenSet of soldTokenSets) {
    let row = $("div#row" + rowCount);
    for (let tokenId of tokenSet) {
      $(row).append("<div id=\"col" + tokenId + "\"></div>")
      const col = $("div#col" + tokenId, row);
      $(col).addClass("col nft-display-small no-padding");
      $(col).html(
          "<input class=\"tokenId\" type=\"hidden\" value=\"" + tokenId + "\"/>" +
          "<div class=\"d-none\">" +
              "<br/>" +
              "<div class=\"soldFor d-flex justify-content-center fs-large ff-lulo\"> 0</div>" +
          "</div>" +
          "<img class=\"img-max\" src=\"https://arweave.net/" + tokenImageHashes[tokenId] + "\" class=\"img-max p-1\" alt=\"\"/>");
    }
    rowCount++;
  }
}

//
// Web3 actions
//

async function collect() {
  const collectButton = $(this);
  flashColor(collectButton, "btn-primary", "btn-secondary");
  const signerAddr = await signer.getAddress();
  let tokenId;
  let success = false;
  for (tokenId of tokensSold) {
    const address = await auction.winnerOf(tokenId);
    if (address == signerAddr) {
      success = true;
      break;
    }
  }
  if (success) {
    auction.collect(tokenId)
      .then(tx => {
        flashColor(collectButton, "btn-secondary", "btn-success");
        setTimeout(flashColor, 1000, collectButton, "btn-success", "btn-primary")
        return tx.wait();
      })
      .then(res => {
        flashColor(collectButton, "btn-secondary", "btn-success");
        setTimeout(flashColor, 1000, collectButton, "btn-success", "btn-primary")
      })
      .catch(err => {
        flashColor(collectButton, "btn-secondary", "btn-danger");
        setTimeout(flashColor, 1000, collectButton, "btn-danger", "btn-primary")
      });
  } else {
    flashColor(collectButton, "btn-secondary", "btn-danger");
    setTimeout(flashColor, 1000, collectButton, "btn-danger", "btn-primary")
  }
}

function bid() {
  const bidButton = $(this);
  const pppp = $(this).parent().parent().parent().parent().parent();
  const tokenId = parseInt($(".tokenId", pppp).val())
  let bid = $("input.bidAmount", pppp).val();
  bid = ethers.utils.parseUnits(bid, 'ether');
  auction.bidTopUp(tokenId, {value: bid})
    .then(tx => {
      console.log("bid transaction submitted");
      flashColor(bidButton, "btn-primary", "btn-secondary");
      return tx.wait();
    })
    .then(res => {
      console.log("bid transaction success");
      flashColor(bidButton, "btn-secondary", "btn-success");
      setTimeout(flashColor, 1000, bidButton, "btn-success", "btn-primary")
    })
    .catch(err => {
      console.error(err);
      flashColor(bidButton, "btn-secondary", "btn-danger");
      setTimeout(flashColor, 1000, bidButton, "btn-danger", "btn-primary")
    })
}

function upbid() {
  const upbidButton = $(this);
  const pppp = $(this).parent().parent().parent().parent().parent();
  const tokenId = parseInt($(".tokenId", pppp).val())
  let bid = $(this).data("amount");
  bid = ethers.utils.parseUnits(bid.toString(), 'ether');
  auction.bidTopUp(tokenId, {value: bid})
    .then(tx => {
      console.log("bid transaction submitted");
      flashColor(upbidButton, "btn-primary", "btn-secondary");
      return tx.wait();
    })
    .then(res => {
      console.log("bid transaction success");
      flashColor(upbidButton, "btn-secondary", "btn-success");
      setTimeout(flashColor, 1000, upbidButton, "btn-success", "btn-primary")
    })
    .catch(err => {
      console.error(err);
      flashColor(upbidButton, "btn-secondary", "btn-danger");
      setTimeout(flashColor, 1000, upbidButton, "btn-danger", "btn-primary")
    });
}

function withdraw() {
  const withdrawButton = $(this);
  auction.withdraw()
    .then(tx => {
      console.log("withdraw transaction submitted");
      flashColor(withdrawButton, "btn-primary", "btn-secondary");
      return tx.wait();
    })
    .then(res => {
      console.log("withdraw transaction success");
      flashColor(withdrawButton, "btn-secondary", "btn-success");
      setTimeout(flashColor, 1000, withdrawButton, "btn-success", "btn-primary")
    })
    .catch(err => {
      console.error(err);
      flashColor(withdrawButton, "btn-secondary", "btn-danger");
      setTimeout(flashColor, 1000, withdrawButton, "btn-danger", "btn-primary")
    })
}

function switchNetwork() {
    ethereum
        .request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_MAINNET_PARAMS]
        })
        .then(handleChainChanged)
        .catch((error) => {
            console.error("switch network", error)
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
            showButton(ACTION_GROUP_1, "connect");
            showButton(ACTION_GROUP_2, "connect");
        } else {
            console.error("connect account", err);
        }
        });
}

//
// Handlers
//

function handleChainChanged(chainId) {
    window.location.reload();
}


function handleConnect(connectInfo) {
    console.log('Connected', connectInfo);
    chainId = connectInfo.chainId;
    ethereum.request({ method: 'eth_accounts'})
      .then(accounts => {
        if (accounts.length === 0 && chainId == AVALANCHE_MAINNET_PARAMS.chainId) {
            showButton(ACTION_GROUP_1, "connect");
            showButton(ACTION_GROUP_2, "connect");
          throw new Error("Account not connected");
        } else if (chainId != AVALANCHE_MAINNET_PARAMS.chainId) {
            showButton(ACTION_GROUP_1, "switch");
            showButton(ACTION_GROUP_2, "switch");
          throw new Error("Wrong network connected");
        } else {
          console.log("Metamask connected");
          showButton(ACTION_GROUP_1, "withdraw");
          // showButton(ACTION_GROUP_2, "mint");
        }
        return accounts[0];
      })
      .catch(err => {
        console.error("handle connect", err);
      })
    if (chainId != AVALANCHE_MAINNET_PARAMS.chainId) {
        showButton(ACTION_GROUP_1, "switch");
        showButton(ACTION_GROUP_2, "switch");
    }
}

function handleDisconnect(error) {
    console.error('Disconnected', error);
    window.location.reload()
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showButton(ACTION_GROUP_1, "connect");
        showButton(ACTION_GROUP_2, "connect");
      console.log("No accounts available");
    } else {
      let signerAddr;
      signer.getAddress()
        .then(addr => {
          if (accounts[0] !== addr) {
            signer = provider.getSigner(accounts[0]);
            signerAddr = addr;
            // showLoading(ACTION_GROUP_2);
            //return neko.approve(lottoAddr, amt);
          } else {
            throw new Error("This shouldn't happen", accounts)
          }
        })
        .then(tx => {
          console.log("Approval transaction submitted");
        //   return tx.wait();
        })
        .then(res => {
          console.log("Approval transaction success");
          showButton(ACTION_GROUP_1, "withdraw");
          // showButton(ACTION_GROUP_2, "mint");
          console.log("Account changed to", accounts[0]);
        })
        .catch(err => {
          console.error(err);
        })
    }
}

//
// Init
//

function initialize() {
    detectEthereumProvider().then(eth => {
      if (eth) {
        if (eth !== window.ethereum) {
          console.error("Do you have multiple wallets?");
        }
        console.log("Starting the app");

        provider = new ethers.providers.Web3Provider(eth);
        signer = provider.getSigner(0);
        ultra64 = new ethers.Contract(ultra64Addr, ultra64Abi, signer);
        auction = new ethers.Contract(auctionAddr, auctionAbi, signer);

        showSoldItems();
        $('div.nft-display-large').hover(hideDetails, showDetails);
        $('div.nft-display-small').hover(hideDetails, showDetails);

        // poll auction data
        pollLiveAuctionData();
        pollPastAuctionData();
        pollNekoOwnership();

        console.log("Auction contract:", auctionAddr);
        console.log("Ultra64 contract:", ultra64Addr);
      } else {
        console.log("Install MetaMask");
        showButton(ACTION_GROUP_1, "install");
      }
    });

    $('button.install').click(installMetaMask);
    $('button.switch').click(switchNetwork);
    $('button.connect').click(connectAccount);
    $('button.bid').click(bid);
    $('button.upbid').click(upbid);
    $('button.withdraw').click(withdraw);
    $('button.mint').click(collect);

    $(document).click(function (event) {
      var clickover = $(event.target);
      var _opened = $(".collapse").hasClass("show");
      if (_opened === true && !clickover.hasClass("navbar-toggler")) {
        $(".navbar-toggler").click();
      }
    });
  }

async function pollNekoOwnership() {
  try {
    const signerAddr = await signer.getAddress();
    const balance = await ultra64.balanceOf(signerAddr);
    const tokenId = await ultra64.assignedToken(signerAddr);
    if (balance > 0) {
      $("#mintNftBox").addClass("d-none");
    } else {
      $("#mintNftBox").removeClass("d-none");
    }
  } catch (error) {
    // console.error(error);
  }
  setTimeout(pollNekoOwnership, 1000);
}

async function pollLiveAuctionData() {
  const signerAddr = await signer.getAddress();
  for (let tokenId of tokensOnSale) {
    const highBid = await auction.highestBidOn(tokenId);
    const myBid = await auction.bidOf(signerAddr, tokenId);
    const live = $("#live >> ");
    const p = $(".tokenId[value=" + tokenId +"]", live).parent();
    $(".myBid", p).text(parseInt(ethers.utils.formatUnits(myBid, "ether")));
    $(".highBid", p).text(parseInt(ethers.utils.formatUnits(highBid, "ether")));
    if (myBid > 0) {
      $(".bidBox", p).hide();
      $(".upbidBox", p).show();
    } else {
      $(".upbidBox", p).hide();
      $(".bidBox", p).show();
    }
  }
  setTimeout(pollLiveAuctionData, 1000);
}

async function pollPastAuctionData() {
  for (let tokenId of tokensSold) {
    const highBid = await auction.highestBidOn(tokenId);
    const sold = $("#sold >> ");
    const p = $(".tokenId[value=" + tokenId +"]", sold).parent();
    $(".soldFor", p).text(parseInt(ethers.utils.formatUnits(highBid, "ether")));
  }
}

if (window.ethereum !== undefined) {
    console.log("Registering event handlers");
    ethereum.on('connect', handleConnect);
    ethereum.on('disconnect', handleDisconnect);
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);
}

$(document).ready(initialize)
