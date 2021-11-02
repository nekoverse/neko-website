import { useState, Fragment } from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faTelegramPlane, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover, Transition } from '@headlessui/react'
import Image from 'next/image'
import nekoLogo from "../public/images/logo_trans_200.png"

import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from "ethers";
import useEtherSWR from 'ether-swr'


import { useContractAddresses, useContracts } from '../hooks/evm'
import { AVALANCHE_CHAIN_ID, FUJI_CHAIN_ID, validChainId } from '../lib/evm'
import { useHasWeb3Provider } from '../components/ProviderDetectorContext'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Networks = {
  Avalanche: AVALANCHE_CHAIN_ID,
  Fuji: FUJI_CHAIN_ID
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    Networks.Avalanche,// Avalanche
    Networks.Fuji
  ]
})

function LottoDeposit({ account }) {
  const { lotto } = useContractAddresses()
  const { data: lottoDeposit } = useEtherSWR(account ? [lotto, 'depositOf', account] : [])
  return (
    <>
      {lottoDeposit && String(lottoDeposit.toString() / 10 ** 17)}B
    </>
  )

}

function Lotto() {
  const hasWeb3Provider = useHasWeb3Provider()
  const { account, active, chainId } = useWeb3React()
  const connectWallet = function () {
    activate(injectedConnector)
  }
  return (
    <>
      {active ? (
        <>
          {account ? (
            <>
              <div id="buyLottoTicket"
                className="action-section position-relative pt-3 pb-3 alert alert-primary mx-auto d-none">
                <div className="text-center fs-smaller">
                  Enter the lotto with NEKO
                </div>
                <div className="pt-3 pb-3">
                  <div className="input-group input-group-lg mb-3 pl-4 pr-4">
                    <input type="text" className="buyLotto form-control left-rounded" aria-label="Amount (to the nearest dollar)" />
                    <span className="input-group-text">B</span>
                    <button type="button" className="buyLotto btn btn-lg btn-primary right-rounded">Buy</button>
                  </div>
                </div>
              </div>
              <div id="alreadyBought"
                className="action-section position-relative pt-3 pb-3 alert alert-primary mx-auto d-none">
                <div className="text-center fs-smaller">
                  You are in this draw already.
                </div>
                <div id="myStake" className="pt-1 pb-1 fs-extra-large text-center">
                  <LottoDeposit account={account} />
                </div>
              </div>
              <div id="lottoStatus"
                className="action-section position-relative pt-3 pb-3 alert alert-primary mx-auto d-none">
                <h5>DRAW #<span id="drawNo">x</span></h5>
                <div className="row fs-normal">
                  <div className="col-9">Entries:</div>
                  <div id="entries" className="col">x</div>
                </div>
                <div className="row fs-normal">
                  <div className="col-9">Total so far:</div>
                  <div id="totalSoFar" className="col">x</div>
                </div>
                <div className="row fs-normal">
                  <div className="col-9">Max deposit:</div>
                  <div id="maxDeposit" className="col">x</div>
                </div>
              </div>
            </>
          ) : (
            <div id="loading2" className="action-section relative mx-auto">
              <img src="images/loading.gif" className="mx-auto d-block pb-2" alt="Loading"></img>
              <div className="text-center mx-auto">
                You need to approve me, <br />check your MetaMask
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {hasWeb3Provider ? (
            (chainId && !validChainId(chainId)) ? (
              <div id="switchNetworkBox2"
                className="action-section relative pt-3 pb-3 alert alert-danger mx-auto flex flex-col items-center">
                <div className="text-center pb-3 fs-smaller" role="alert">
                  NEKOs live on Avalanche.<br /> Switch the network.
                </div>
                <button className="switch btn btn-lg btn-danger mx-auto rounded-full" type="submit">Switch to Avalanche</button>
              </div>
            ) : (
              <div id="connectWalletBox2"
                className="action-section position-relative pt-3 pb-3 alert alert-danger mx-auto flex flex-col items-center">
                <div className="text-center pb-3 fs-smaller" role="alert">
                  Connect your wallet to play the lotto.
                </div>
                <button className="connect btn btn-lg btn-danger mx-auto d-block rounded-full"
                  onClick={connectWallet}>
                  Connect Wallet
                </button>
              </div>
            )
          ) : (
            <div id="installMetamaskBox2"
              className="action-section position-relative pt-3 pb-3 alert alert-danger mx-auto flex flex-col items-center">
              <div className="text-center pb-3 fs-smaller" role="alert">
                Install MetaMask to get started.
              </div>
              <button className="install btn btn-lg btn-danger mx-auto rounded-full" type="submit">Install MetaMask</button>
            </div>
          )}

        </>
      )}
    </>
  )
}



function Buy() {
  const hasWeb3Provider = useHasWeb3Provider()
  const { activate, active, account, library, connector, chainId, error } = useWeb3React()
  const connectWallet = function () {
    activate(injectedConnector)
  }
  const { shop } = useContracts()
  const [buying, setBuying] = useState(false)
  function buyNeko(rawAmount) {
    if (rawAmount == '0.08' || rawAmount == '0.8' || rawAmount == '8.0') {
      const amount = ethers.utils.parseUnits(rawAmount, 'ether');
      shop.buy({ value: amount, gasLimit: 250000 })
        .then(tx => {
          console.log("Buy transaction submitted");
          setBuying(true)
          return tx.wait();
        })
        .then(res => {
          setBuying(false)
          console.log("Buy transaction success");
        })
        .catch(err => {
          setBuying(false)
          console.error(err);
          // TODO: communicate this to the user
        })
    } else {
      console.error('Unexpected amount:', rawAmount);
    }
  }

  return (
    <>
      {active ? (
        <>
          {account ? (
            buying ? (
              <div id="buying1"
                className="action-section position-relative mx-auto d-none">
                <img src="images/loading.gif" className="mx-auto d-block pb-2" alt="Please wait"></img>
                <div className="text-center">
                  Getting your NEKOs<br />Please wait and don't refresh the page.
                </div>
              </div>
            ) : (
              <div id="buyNekoBox"
                className="action-section position-relative pt-3 pb-3 d-none alert alert-primary mx-auto">
                <div className="text-center fs-smaller">
                  Buy me with AVAX
                </div>
                <div className="pt-3 pb-3">
                  <div className="d-flex justify-content-center">
                    <div className="btn-group btn-group-lg pb-2" role="group" aria-label="Buy me">
                      <button type="button" className="buy btn btn-primary left-rounded"
                        onClick={() => buyNeko("0.08")}>
                        0.08
                      </button>
                      <button type="button" className="buy btn btn-primary"
                        onClick={() => buyNeko("0.8")}>
                        0.8
                      </button>
                      <button type="button" className="buy btn btn-primary right-rounded"
                        onClick={() => buyNeko("8")}>
                        8.0
                      </button>
                    </div>
                  </div>
                  <div className="text-center">(pick how many AVAX worth you want)</div>
                </div>
                <div className="text-center fs-smaller pb-2">OR</div>
                <div className="text-center">
                  <a id="add-link" href="" className="fs-smaller">Add me to your wallet for later</a>
                </div>
              </div>
            )
          ) : (
            <div id="loading1"
              className="action-section position-relative mx-auto">
              <img src="images/loading.gif" className="mx-auto d-block pb-2" alt="Loading"></img>
              <div className="text-center">
                If I don't dissappear soon, <br />refresh the page
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {hasWeb3Provider ? (
            chainId && !validChainId(chainId) ? (
              <div id="switchNetworkBox1"
                className="action-section position-relative pt-3 pb-3 d-none alert alert-danger mx-auto">
                <div className="text-center pb-3 fs-smaller" role="alert">
                  NEKOs live on Avalanche.<br /> Switch the network.
                </div>
                <button className="switch btn btn-lg btn-danger mx-auto d-block rounded-pill" type="submit">Switch to Avalanche</button>
              </div>
            ) : (
              <div
                className="relative pt-3 pb-3 text-center alert alert-danger mx-auto">
                <div className="pb-3 fs-smaller" role="alert">
                  Connect your wallet to get your NEKOs.
                </div>
                <button className="connect btn btn-lg btn-danger mx-auto d-block rounded-full"
                  onClick={connectWallet}>
                  Connect Wallet
                </button>
              </div>
            )
          ) : (
            <div className="action-section relative pt-3 pb-3 alert alert-danger mx-auto flex flex-col items-center">
              <div className="text-center pb-3 text-sm" role="alert">
                Install MetaMask to get started.
              </div>
              <button className="btn btn-lg btn-danger mx-auto rounded-full">
                Install MetaMask
              </button>
            </div>
          )
          }
        </>
      )}
    </>
  )
}

export default function Home() {
  const { activate, active } = useWeb3React()
  const connectWallet = function () {
    activate(injectedConnector)
  }

  return (
    <>
      <header className="flex flex-row p-4 justify-between">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open ? 'text-gray-900' : 'text-gray-800',
                  'text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                )}
              >
                <FontAwesomeIcon icon={faBars} className="w-8 h-8" />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 transform -left-4 mt-3 px-2 w-screen max-w-xs sm:px-0">
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                      <a className="fs-normal menu-item" href="#vision">Vision</a>
                      <a className="fs-normal menu-item" href="#lottery">Lotto</a>
                      <a className="fs-normal menu-item" href="#characters">Characters</a>
                      <a className="fs-normal menu-item" href="#art">Art</a>
                      <a className="fs-normal menu-iem" href="auction.html">Auction</a>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <div className="justify-self-center flex flex-row gap-2">
          <a href="https://discord.gg/FCfrVDaMTP">
            <FontAwesomeIcon icon={faDiscord} className="social-icon" title="Discord" />
          </a>
          <a href="https://t.me/neko_luckycat_g">
            <FontAwesomeIcon icon={faTelegramPlane} className="social-icon" title="Telegram" />
          </a>
          <a href="https://twitter.com/LuckyCatNEKO1">
            <FontAwesomeIcon icon={faTwitter} className="social-icon" title="Twitter" />
          </a>
          <a href="https://github.com/nekoverse/neko-contracts">
            <FontAwesomeIcon icon={faGithub} className="social-icon" title="GitHub" />
          </a>
        </div>

        <div className="" >
          {/* hide i18n for now but keep item there for positioning purposes
                  <a className="nav-link dropdown-toggle fs-smaller" href="#" id="navbarDropdownMenuLink78" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="flag-icon flag-icon-us text-2xl"></span></a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink78">
            <a className="dropdown-item" href="index.html"><span className="flag-icon flag-icon-us text-2xl"></span> English</a>
            <a className="dropdown-item" href="index.zh.html"><span className="flag-icon flag-icon-cn text-2xl"></span> 汉语</a>
            <a className="dropdown-item" href="index.ru.html"><span className="flag-icon flag-icon-ru text-2xl"></span> Русский</a>
          </div>
         */}
        </div>

      </header>
      <main className="p-4">
        <section className="pt-5">
          <div className="max-w-xs mx-auto mb-6">
            <Image src={nekoLogo} layout="responsive" alt="Neko Logo" />
          </div>
          <h1 className="text-center text-5xl mb-6">NEKO</h1>
          <div className="text-center text-lg fs-normal mb-8">
            <p className="mb-1">I bring wealth and good fortune.</p>
            <p>Buy me to make your wallet lucky.</p>
          </div>
          <div>
            <Buy />
          </div>

          <div className="text-center fs-normal my-4">
            <p>Total supply: 8,888,888,888,888,888<br />
              No inflation, No deflation, No tax.</p>
          </div>

          <div className="text-center fs-normal my-4">
            <p>NEKO contract on Avalanche C-Chain:<br />
              <a href="https://cchain.explorer.avax.network/address/0xD9702F5E3b0eb7452967CB82529776D672bdC03F/transactions"
                className="contract-id">
                0xD9702F5E3b0eb7452967CB82529776D672bdC03F
              </a>
            </p>
          </div>
          <br />
          <div className="">
            <div className="text-center fs-normal">
              <a href="auction.html">
                <img src="images/ultra64-promo.gif" alt="Neko Logo"></img>
                <div className="fs-large ff-lulo">Ultra 64</div>
                <div><b>NFT Collection</b></div>
                <div><i>On Sale Now!</i></div>
              </a>
            </div>
          </div>
          <br />
          <div className="position-relative pt-3 pb-3">
            <p className="mb-4 text-center text-2xl font-bold">NEKO Markets:</p>
            <div className="flex flex-row justify-center gap-4">
              <span className="m-1">
                <a href="https://info.pangolin.exchange/#/token/0xd9702f5e3b0eb7452967cb82529776d672bdc03f">
                  <img src="images/pangolin_logo.svg" className="w-8 h-8" alt="Pangolin" />
                </a>
              </span>
              <span className="m-1">
                <a href="https://www.traderjoexyz.com/#/trade">
                  <img src="images/traderjoe_logo.png" className="w-8 h-8" alt="Trader Joe" />
                </a>
              </span>
              <span className="m-1">
                <a href="https://nomics.com/assets/neko3-lucky-cat">
                  <img src="images/nomics_logo.png" className="w-8 h-8" alt="Nomics" />
                </a>
              </span>
              <span className="m-1"><a href="https://swap.olive.cash/#/swap">
                <img src="images/olive_logo.png" className="w-8 h-8" alt="Olive" />
              </a>
              </span>
              <span className="m-1">
                <a href="https://www.livecoinwatch.com/price/LuckyCat-_NEKO">
                  <img src="images/livecoinwatch_logo.png" className="w-8 h-8" alt="Olive" />
                </a>
              </span>
            </div>
          </div>
          <hr />
        </section >
        <section id="vision" className="pt-5">
          <div className="row pb-3">
            <div className="col-3">
              <h4>VISION</h4>
            </div>
            <div className="col w-75 fs-normal">
              <p>NEKO is the main character of a brand new world, a world of optimism and good luck.</p>
              <p>This world - Nekoverse - will grow over time with new characters, stories, on-chain games and other content.</p>
            </div>
          </div>
          <div className="row pb-3">
            <div className="col-3">
              <h4>NEKOVERSE</h4>
            </div>
            <div className="col w-75 fs-normal">
              <img src="images/world.jpg" className="img-max" alt="Nekoverse" />
            </div>
          </div>
          <div className="row pb-3">
            <div className="col-3">
              <h4>ROADMAP</h4>
            </div>
            <div className="col w-75 fs-normal">
              <p>There isn't one. Nekoverse will grow organically and randomly. It will go in strange directions that at times might not make sense but, in the end, everything will come together.</p>
              <p>NEKO is a creative project above all else and a rigid roadmap at this point will do more harm than good.</p>
            </div>
          </div>
          <hr />
        </section>
        <section id="lottery" className="pt-5">
          <div className="relative pb-3">
            <h2 className="fw-bold text-center text-dark">NEKO LOTTO</h2>
          </div>
          <div className="relative pb-3">
            <div className="text-center fs-normal">
              <p>By playing the lotto you help improve NEKO's liquidity.<br />
                You can also win.</p>
            </div>
          </div>
          <Lotto />
          <div className="relative pb-3 fs-normal">
            <p className="font-bold">Here is how it works</p>
            <ul>
              <li>Each draw requires 8 entries.</li>
              <li>You can only enter a draw once.</li>
              <li>You can enter a draw with any amount of NEKOs (in billions).</li>
              <li>Your chances of winning are proportional to your stake.</li>
              <li>If you win, 90% of the pool is sent to your wallet.</li>
              <li>The remaining 10% is added as NEKO liquidity on one of the exchanges.</li>
              <li>Once the winner is chosen the lotto resets and you can enter again.</li>
            </ul>
          </div>
          <div className="relative pt-3 pb-3">
            <div className="text-center fs-normal">
              <p>NEKO Lotto contract on Avalanche C-Chain:<br />
                <a href="https://cchain.explorer.avax.network/address/0x73F1E988f6B3f7Cb64986fBcCF4F1a99E740274c/transactions"
                  className="contract-id">
                  0x73F1E988f6B3f7Cb64986fBcCF4F1a99E740274c
                </a>
              </p>
            </div>
          </div >
          <hr />
        </section >
        <section id="characters" className="pt-5">
          <div className="position-relative pb-3">
            <h2 className="fw-bold text-center text-dark">NEKO CHARACTERS</h2>
          </div>
          <div className="position-relative pb-3">
            <div className="text-center fs-normal">
              <p>Meet NEKO characters!</p>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <div className="inline-block">
                <h4 className="absolute">NEKO</h4>
              </div>
            </div>
            <div className="col-2 fs-normal">
              <img src="images/neko.png" className="img-profile" alt="Neko" />
            </div>
            <div className="col w-75 fs-normal">
              <p>Neko is the main protagonist of Nekoverse.</p>
              <p>Everyone loves Neko and Neko loves them all back. Neko is cute, fluffy, lucky kitty that wants to make the world a better place. </p>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-3">
              <div className="inline-block">
                <h4 className="absolute">REBEL</h4>
              </div>
            </div>
            <div className="col-2 fs-normal">
              <img src="images/rebel.png" className="img-profile" alt="Rebel" />
            </div>
            <div className="col w-75 fs-normal">
              <p>Rebel is the "bad boy" of Nekoverse.</p>
              <p>Rebel is everything Neko is not. He never misses an opportunity to harm Neko, but it almost never works and Neko never holds a grudge.  </p>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-3">
              <div className="inline-block">
                <h4 className="absolute">SQUARE</h4>
              </div>
            </div>
            <div className="col-2 fs-normal">
              <img src="images/square.png" className="img-profile" alt="Rebel" />
            </div>
            <div className="col w-75 fs-normal">
              <p>Square is "Mr. Right" of Nekoverse.</p>
              <p>Square likes to follow rules. He notices and reports everyone who breaks them. This naturally puts him against Rebel who tries to hide his activities from Square.   </p>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-3">
              <div className="inline-block">
                <h4 className="absolute">QUICKY</h4>
              </div>
            </div>
            <div className="col-2 fs-normal">
              <img src="images/ball.png" className="img-profile" alt="Quicky" />
            </div>
            <div className="col w-75 fs-normal">
              <p>Quicky is the athlete of Nekoverse.</p>
              <p>Quicky is fast, he plays ball, and stays away from drama. Quicky is annoyed by slowness. If you move slow, speak slow or think slow - don't expect much sympathy.  </p>
            </div>
          </div>
          <br />
          <br />
          <div className="position-relative pb-3">
            <div className="text-center fs-normal">
              <p>New characters are released every few weeks.</p>
            </div>
          </div>
          <hr />
        </section>
        <section id="art" className="pt-5">
          <div className="position-relative pb-3">
            <h2 className="fw-bold text-center text-dark">NEKO ART</h2>
          </div>
          <div className="position-relative pb-3">
            <div className="text-center fs-normal">
              <p>NEKO regularly drops artwork on the community.<br />
                This is the list of drops so far.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="inline-block">
                <h4 className="absolute">NKT1</h4>
                <div className="fs-normal ml-24">Early Days:</div>
              </div>
            </div>
            <div className="col-8 fs-normal">
              <a href="https://cchain.explorer.avax.network/tokens/0xE61Bd1F5a3e9440704fcB0f18dA421E114d5266D/token-transfers"
                className="contract-id">
                0xE61Bd1F5a3e9440704fcB0f18dA421E114d5266D
              </a>
              <div className="container pt-2 pb-4">
                <div className="row">
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://xyhqewpq5o3uwgfksyjakoqbpl3elg37mcolt2aqvrzp7i2vye5q.arweave.net/vg8CWfDrt0sYqpYSBToBevZFm39gnLnoEKxy_6NVwTs" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://cuh25brveoa32zsym43jcivoe65abbsacfkfodcjzlctwfcwv65a.arweave.net/FQ-uhjUjgb1mWGc2kSKuJ7oAhkARVFcMScrFOxRWr7o" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://3hifp3ixgovrd6jbeo436rqqmtfrcihlff5mfo23aj6uqn6t6mbq.arweave.net/2dBX7RczqxH5ISO5v0YQZMsRIOspesK7WwJ9SDfT8wM" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://itmhk2se26gvq5hvfdw6hy2xkrapyvznloxbgf2ewfs7q6zf5k6a.arweave.net/RNh1akTXjVh09Sjt4-NXVED8Vy1brhMXRLFl-Hsl6rw" className="img-max p-1" alt="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://7rphsg5f4nr3qbxhsjp6u5lxrbarbq5nd422twkf6tkv35spv4ya.arweave.net/_F55G6XjY7gG55Jf6nV3iEEQw60fNanZRfTVXfZPrzA" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://ogintiqwi6qcxb7vk5iqnoopdrxodts2xds727ujeto63rzixzqq.arweave.net/cZDZohZHoCuH9VdRBrnPHG7hzlq45f1-iSTd7ccovmE" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://bljntpbtxfrn227yyxtzolray2b2fjqyvpetyuekgd657bqzjrta.arweave.net/CtLZvDO5Yt1r-MXnly4gxoOiphiryTxQijD934YZTGY" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://battdq2rpbs5d5vd6cyrrhmdy473yql6nq4qhocehc2zwokh3aaa.arweave.net/CCcxw1F4ZdH2o_CxGJ2Dxz-8QX5sOQO4RDi1mzlH2AA" className="img-max p-1" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="inline-block" >
                <h4 className="absolute">NKT2</h4>
                <div className="fs-normal ml-24">Stay Pawsitive:</div>
              </div>
            </div>
            <div className="col-8 fs-normal">
              <a href="https://cchain.explorer.avax.network/tokens/0x7EB0eDf73bd6E4338a24BF1B62A3b0303518A211/token-transfers"
                className="contract-id">
                0x7EB0eDf73bd6E4338a24BF1B62A3b0303518A211
              </a>
              <div className="container pt-2 pb-4">
                <div className="row">
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://mndqs7rlhghdyo5amezvdhf2fyc5h4fgb37k3rgrvnybc2rtreiq.arweave.net/Y0cJfis5jjw7oGEzUZy6LgXT8KYO_q3E0atwEWoziRE" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://rt3fex4iyu2f6dp4rdpdse3uu7gn3sv2dneg5ga4mahxvm44nw7a.arweave.net/jPZSX4jFNF8N_IjeORN0p8zdyrobSG6YHGAPerOcbb4" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://4riaawzya4byi7x5lvxkjw6hbp2zjs23c5tojnbmp5yd567yeqdq.arweave.net/5FAAWzgHA4R-_V1upNvHC_WUy1sXZuS0LH9wPvv4JAc" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://lp6k3tl6qbfhzeeoab3os6rxq6dqvru366lykaufijvi6u6yw3oq.arweave.net/W_ytzX6ASnyQjgB26Xo3h4cKxpv3l4UChUJqj1PYtt0" className="img-max p-1" alt="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://wjykwdegts2onjnzgnhvu44luokrwbv2ekiy4dgw3phdcop6koya.arweave.net/snCrDIactOaluTNPWnOLo5UbBroikY4M1tvOMTn-U7A" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://cznsk4pkz35tp7uvsaiqt6nojua2vougka3paqji3zod6m4o3euq.arweave.net/FlslcerO-zf-lZARCfmuTQGquoZQNvBBKN5cPzOO2Sk" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://dw3imcu2ezkp5m4mqybptkzrplbrmeh6upxajt4eshwvq7r7rpha.arweave.net/HbaGCpomVP6zjIYC-asxesMWEP6j7gTPhJHtWH4_i84" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://p4waxxdhv6h74v7lkmrctkbnkihjiinu22lbcmj4rnufaorgp4kq.arweave.net/fywL3Gevj_5X61MiKagtUg6UIbTWlhExPItoUDomfxU" className="img-max p-1" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="inline-block">
                <h4 className="absolute">NKT3</h4>
                <div className="fs-normal ml-24">SuperNeko 16bit:</div>
              </div>
            </div>
            <div className="col-8 fs-normal">
              <a href="https://cchain.explorer.avax.network/tokens/0x77dfd577a28A4937559e66F3E44De85A13de1116/token-transfers"
                className="contract-id">
                0x77dfd577a28A4937559e66F3E44De85A13de1116
              </a>
              <div className="container pt-2 pb-4">
                <div className="row">
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://7jmpksiratkptzufg5pfn35xgeiqnxhe5phfjneevcnfz2sksaia.arweave.net/-lj1SREE1PnmhTdeVu-3MREG3OTrzlS0hKiaXOpKkBA" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://2epzmsx5m3bfg6iqceipqrep66n462vbtnsblfuuhmdmaqiwikaa.arweave.net/0R-WSv1mwlN5EBEQ-ESP95vPaqGbZBWWlDsGwEEWQoA" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://yj2lhzizcl7dhmcbssljr4h55p2xxafup7xwhmo5fmj5mjceey6a.arweave.net/wnSz5RkS_jOwQZSWmPD96_V7gLR_72Ox3SsT1iREJjw" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://cw7vuuujsgr3rsfp4uyxhw6vli476zlj7b7qp6r3ooovc25d7yyq.arweave.net/Fb9aUomRo7jIr-Uxc9vVWjn_ZWn4fwf6O3OdUWuj_jE" className="img-max p-1" alt="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://ubl4oweigua5viixtpdnetgylall3ios5yq33nytfl7mbaymjsxq.arweave.net/oFfHWIg1AdqhF5vG0kzYWBa9odLuIb23Eyr-wIMMTK8" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://pg2si2ooi5a5zyycjppsye46ttvsjdygxbmjhx4tcncapxrvqzxq.arweave.net/ebUkac5HQdzjAkvfLBOenOskjwa4WJPfkxNEB941hm8" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://y7cm3w5oyouuhjoq36qznoeuywngegzo5cch7vfmsas5cho7v2xq.arweave.net/x8TN267DqUOl0N-hlriUxZpiGy7ohH_UrJAl0R3frq8" className="img-max p-1" alt="" />
                  </div>
                  <div className="col nft-display no-padding">
                    <img className="img-max" src="https://6ita2tkqk3yxv3ujxn526uf56do4fwhf7za5jbro5nqeoh34amoq.arweave.net/8iYNTVBW8Xruibt7r1C98N3C2OX-QdSGLutgRx98Ax0" className="img-max p-1" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >
      </main >

      <footer className="pt-3 pb-3">
        <div className="mx-auto text-center fs-smaller">
          <p>*This is not an investment product. Do your own research.</p>
        </div>
        <div className="w-25 mx-auto">
          <a href="https://www.avalabs.org/"><img src="images/poweredbyavalanchewhite.png" className="img-fluid mx-auto d-block" alt="Powered by Avalanche" /></a>
        </div>
      </footer>
    </>
  )
}
