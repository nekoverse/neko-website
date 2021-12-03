import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { useWeb3React } from '@web3-react/core'
import { ethers } from "ethers";
import useEtherSWR from 'ether-swr'

import nekoLogo from "../public/images/logo_trans_200.png"
import ultra64Gif from "../public/images/ultra64-promo.gif"
import nekoImage from "../public/images/neko.png"
import rebelImage from "../public/images/rebel.png"
import squareImage from "../public/images/square.png"
import quickyImage from "../public/images/ball.png"

import { useContractAddresses, useContracts } from '../hooks/evm'
import { formatNekoBillions, injectedConnector, validChainId } from '../lib/evm'
import { useHasWeb3Provider } from '../components/ProviderDetectorContext'
import Nav from '../components/Nav'

function LottoState({ account }) {
  const { neko: nekoAddr, lotto: lottoAddr } = useContractAddresses()
  const { data: lottoState } = useEtherSWR(account ? [
    [lottoAddr, 'depositOf', account],
    [lottoAddr, 'drawNo'],
    [lottoAddr, 'playerCount'],
    [lottoAddr, 'maxAmount'],
    [lottoAddr, 'totalAmount'],
    [nekoAddr, 'allowance', account, lottoAddr],
    [nekoAddr, 'balanceOf', account]
  ] : [])
  const [lottoDeposit, drawNo, playerCount, maxDeposit, totalAmount, allowance, nekoBalance] = lottoState ? lottoState : []
  const [lottoAmount, setLottoAmount] = useState()
  const { neko, lotto } = useContracts()

  async function approveLottoSpend() {
    const amountScaled = lottoAmount * 10 ** 9;

    if (!allowance || (allowance < amountScaled)) {
      const amount = ethers.utils.parseUnits(String(amountScaled), 8)
      await neko.approve(lottoAddr, amount)
    }
  }

  const amountScaled = lottoAmount && lottoAmount * 10 ** 9;
  const amountStr = amountScaled && String(amountScaled) + "00000000";
  const amount = amountStr && ethers.BigNumber.from(amountStr);

  async function buyLottoTicket() {
    await lotto.buyIn(amount)
  }
  return (
    <>
      {
        (lottoDeposit && (lottoDeposit > 0)) ? (
          <div id="alreadyBought"
            className="action-section position-relative pt-3 pb-3 alert alert-primary mx-auto d-none">
            <div className="text-center">
              You are in this draw already.
            </div>
            <div className="text-center mt-2">
              Your stake:
            </div>
            <div id="myStake" className="pt-1 pb-1 text-6xl text-center">
              {formatNekoBillions(lottoDeposit)}B
            </div>
          </div>
        ) : (
          <div id="buyLottoTicket"
            className="action-section position-relative pt-3 pb-3 alert alert-primary mx-auto d-none">
            <div className="text-center fs-smaller">
              Enter the lotto with NEKO
            </div>
            <div className="pt-3 pb-3">
              <div className="input-group input-group-lg mb-3 pl-4 pr-4 flex flex-row justify-center m-auto">
                <div className="relative">
                  <input type="text" className="text-xl py-2 outline-none focus:ring-1 ring-inset pl-4 pr-20 w-28"
                    aria-label="Amount (to the nearest dollar)"
                    onChange={e => setLottoAmount(e.target.value)} />
                  <div className="absolute right-0 top-0 h-full mr-2 flex items-center pointer-events-none">B NEKO</div>
                </div>
                {(!amount || (allowance && (allowance >= amount))) ? (
                  <button type="button"
                    onClick={buyLottoTicket}
                    className="btn-pill rounded-r-xl"
                    disabled={!amount || !allowance || (allowance <= 0)}>
                    Enter
                  </button>
                ) : (
                  <button onClick={approveLottoSpend}
                    className="btn-pill rounded-r-xl">
                    Approve
                  </button>
                )}
              </div>
              {(nekoBalance < amount) && <span className="text-red-600">You don't have that many $NEKO!</span>}
            </div>
          </div>
        )
      }

      <div id="lottoStatus"
        className="action-section position-relative pt-3 pb-3 alert alert-primary mx-auto d-none">
        <h5 className="text-xl text-center mb-8">DRAW #<span>{drawNo && drawNo.toString()}</span></h5>
        <div className="grid grid-cols-2 gap-2 fs-normal">
          <div className="text-right">Entries:</div>
          <div className="font-black text-3xl">{playerCount && playerCount.toString()}</div>
          <div className="text-right">Total so far:</div>
          <div className="font-black text-3xl">{totalAmount && formatNekoBillions(totalAmount)}B</div>
          <div className="text-right">Max deposit:</div>
          <div className="font-black text-3xl">{maxDeposit && formatNekoBillions(maxDeposit)}B</div>
        </div>
      </div>
    </>
  )
}



function Lotto() {
  const hasWeb3Provider = useHasWeb3Provider()
  const { account, active, activate, chainId } = useWeb3React()
  const connectWallet = function () {
    activate(injectedConnector)
  }
  return (
    <>
      {active ? (
        <>
          {account ? (
            <LottoState account={account} />
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
                <div className="text-center text-2xl">
                  Buy me with AVAX
                </div>
                <div className="pt-3 pb-3">
                  <div className="flex justify-center">
                    <div className="btn-group btn-group-lg pb-6 pt-2 flex flex-row text-lg" role="group" aria-label="Buy me">
                      <button type="button" className="buy btn-buy rounded-l-xl"
                        onClick={() => buyNeko("0.08")}>
                        0.08
                      </button>
                      <button type="button" className="buy btn-buy"
                        onClick={() => buyNeko("0.8")}>
                        0.8
                      </button>
                      <button type="button" className="buy btn-buy rounded-r-xl"
                        onClick={() => buyNeko("8")}>
                        8.0
                      </button>
                    </div>
                  </div>
                  <div className="text-center">(pick how many AVAX worth you want)</div>
                </div>
                <div className="text-center fs-smaller mb-6">OR</div>
                <div className="text-center">
                  <a id="add-link" href="" className="fs-smaller rounded-xl p-4 bg-gray-200 hover:bg-gray-300 border border-gray-300">Add me to your wallet for later</a>
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
                className="relative pt-3 pb-3 text-center alert alert-danger mx-auto w-96">
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
    <div className="max-w-6xl m-auto">
      <Nav />
      <main className="p-4">
        <section className="pt-5">
          <div className="relative w-32 h-32 md:w-64 md:h-64 mx-auto mb-6">
            <Image src={nekoLogo} layout="fill" alt="Neko Logo" />
          </div>
          <h1 className="text-center text-6xl md:text-8xl mb-9">NEKO</h1>
          <div className="text-center text-lg fs-normal mb-9">
            <p className="mb-1">I bring wealth and good fortune.</p>
            <p>Buy me to make your wallet lucky.</p>
          </div>
          <div className="mb-9">
            <Buy />
          </div>

          <div className="text-center fs-normal mb-12">
            <p>Total supply: 8,888,888,888,888,888<br />
              No inflation, No deflation, No tax.</p>
          </div>

          <div className="text-center fs-normal mb-12">
            <p>NEKO contract on Avalanche C-Chain:<br />
              <a href="https://snowtrace.io/address/0xD9702F5E3b0eb7452967CB82529776D672bdC03F/transactions"
                className="contract-id">
                0xD9702F5E3b0eb7452967CB82529776D672bdC03F
              </a>
            </p>
          </div>
          <br />
          <div className="">
            <div className="text-center m-auto">
              <Link href="/auction">
                <a className="text-blue-600 hover:underline hover:text-blue-900">
                  <Image src={ultra64Gif} alt="Neko Logo"></Image>
                  <div className="fs-large ff-lulo mb-2">Ultra 64</div>
                  <div className="text-3xl mb-2"><b>NFT Collection</b></div>
                  <div className="text-3xl"><i>On Sale Now!</i></div>
                </a>
              </Link>
            </div>
          </div>
          <br />
          <div className="relative pt-3 pb-3 my-8">
            <p className="mb-5 text-center text-2xl">NEKO Markets:</p>
            <div className="flex flex-row flex-wrap justify-center gap-4">
              <span className="m-1">
                <a href="https://info.pangolin.exchange/#/token/0xd9702f5e3b0eb7452967cb82529776d672bdc03f">
                  <img src="images/pangolin_logo.svg" className="market-icon" alt="Pangolin" />
                </a>
              </span>
              <span className="m-1">
                <a href="https://www.traderjoexyz.com/#/trade">
                  <img src="images/traderjoe_logo.png" className="market-icon" alt="Trader Joe" />
                </a>
              </span>
              <span className="m-1">
                <a href="https://nomics.com/assets/neko3-lucky-cat">
                  <img src="images/nomics_logo.png" className="market-icon" alt="Nomics" />
                </a>
              </span>
              <span className="m-1"><a href="https://swap.olive.cash/#/swap">
                <img src="images/olive_logo.png" className="market-icon" alt="Olive" />
              </a>
              </span>
              <span className="m-1">
                <a href="https://www.livecoinwatch.com/price/LuckyCat-_NEKO">
                  <img src="images/livecoinwatch_logo.png" className="market-icon" alt="Olive" />
                </a>
              </span>
            </div>
          </div>
          <hr />
        </section >
        <section id="vision" className="pt-16 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <h4 className="text-2xl mt-2 lg:mt-0">VISION</h4>
          <div className="col-span-3 fs-normal">
            <p className="mb-2">NEKO is the main character of a brand new world, a world of optimism and good luck.</p>
            <p>This world - Nekoverse - will grow over time with new characters, stories, on-chain games and other content.</p>
          </div>
          <h4 className="text-2xl mt-2 lg:mt-0">NEKOVERSE</h4>
          <div className="col-span-3 fs-normal">
            <img src="images/world.jpg" className="img-max" alt="Nekoverse" />
          </div>
          <h4 className="text-2xl mt-2 lg:mt-0">ROADMAP</h4>
          <div className="col-span-3 fs-normal">
            <p className="mb-2">There isn't one. Nekoverse will grow organically and randomly. It will go in strange directions that at times might not make sense but, in the end, everything will come together.</p>
            <p>NEKO is a creative project above all else and a rigid roadmap at this point will do more harm than good.</p>
          </div>
          <hr className="col-span-full my-8" />
        </section>
        <section id="lottery" className="pt-5 md:px-16">
          <div className="relative pb-3">
            <h2 className="fw-bold text-center text-dark text-4xl">NEKO LOTTO</h2>
          </div>
          <div className="relative pb-3">
            <div className="text-center fs-normal">
              <p>By playing the lotto you help improve NEKO's liquidity.<br />
                You can also win.</p>
            </div>
          </div>
          <Lotto />
          <div className="relative pb-3 text-2xl mt-4">
            <p className="font-bold mb-4">Here is how it works:</p>
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
            <h2 className="text-2xl fw-bold text-center text-dark mb-4">NEKO CHARACTERS</h2>
          </div>
          <div className="relative md:pb-3 md:mb-4">
            <div className="text-center">
              <p>Meet NEKO characters!</p>
            </div>
          </div>
          <div className="characters">
            <h4 className="char-name">NEKO</h4>
            <div className="text-lg">
              <Image src={nekoImage} className="img-profile" alt="Neko" />
            </div>
            <div className="char-desc">
              <p>Neko is the main protagonist of Nekoverse.</p>
              <p>Everyone loves Neko and Neko loves them all back. Neko is cute, fluffy, lucky kitty that wants to make the world a better place. </p>
            </div>
            <h4 className="char-name">REBEL</h4>
            <div className="">
              <Image src={rebelImage} className="img-profile" alt="Rebel" />
            </div>
            <div className="char-desc">
              <p>Rebel is the "bad boy" of Nekoverse.</p>
              <p>Rebel is everything Neko is not. He never misses an opportunity to harm Neko, but it almost never works and Neko never holds a grudge.  </p>
            </div>
            <h4 className="char-name">SQUARE</h4>
            <div>
              <Image src={squareImage} className="img-profile" alt="Rebel" />
            </div>
            <div className="char-desc">
              <p>Square is "Mr. Right" of Nekoverse.</p>
              <p>Square likes to follow rules. He notices and reports everyone who breaks them. This naturally puts him against Rebel who tries to hide his activities from Square.   </p>
            </div>
            <h4 className="char-name">QUICKY</h4>
            <div className="col-2 text-lg">
              <Image src={quickyImage} className="img-profile" alt="Quicky" />
            </div>
            <div className="char-desc">
              <p>Quicky is the athlete of Nekoverse.</p>
              <p>Quicky is fast, he plays ball, and stays away from drama. Quicky is annoyed by slowness. If you move slow, speak slow or think slow - don't expect much sympathy.  </p>
            </div>
          </div>
          <div className="relative pb-3 mt-4">
            <div className="text-center">
              <p>New characters are released every few weeks.</p>
            </div>
          </div>
          <hr />
        </section>
        <section id="art" className="pt-5">
          <div className="relative pb-3">
            <h2 className="fw-bold text-center text-dark text-3xl">NEKO ART</h2>
          </div>
          <div className="relative pb-3">
            <div className="text-center fs-normal">
              <p>NEKO regularly drops artwork on the community.<br />
                This is the list of drops so far.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6">
            <div className="col-span-2 sm:row-span-3">
              <h4 className="inline text-xl mr-6">NKT1</h4>
              <span className="fs-normal">Early Days:</span>
            </div>
            <a href="https://cchain.explorer.avax.network/tokens/0xE61Bd1F5a3e9440704fcB0f18dA421E114d5266D/token-transfers"
              className="col-span-2 sm:col-span-4 contract-id">
              0xE61Bd1F5a3e9440704fcB0f18dA421E114d5266D
            </a>
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

            <div className="col-span-2 sm:row-span-3">
              <h4 className="inline text-xl mr-6">NKT2</h4>
              <span className="fs-normal">Stay Pawsitive:</span>

            </div>
            <a href="https://cchain.explorer.avax.network/tokens/0x7EB0eDf73bd6E4338a24BF1B62A3b0303518A211/token-transfers"
              className="col-span-2 sm:col-span-4 contract-id">
              0x7EB0eDf73bd6E4338a24BF1B62A3b0303518A211
            </a>
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
            <div className="col-span-2 sm:row-span-3">
              <h4 className="inline text-xl mr-6">NKT3</h4>
              <span className="fs-normal">SuperNeko 16bit:</span>
            </div>
            <a href="https://cchain.explorer.avax.network/tokens/0x77dfd577a28A4937559e66F3E44De85A13de1116/token-transfers"
              className="col-span-2 sm:col-span-4 contract-id">
              0x77dfd577a28A4937559e66F3E44De85A13de1116
            </a>
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
    </div>
  )
}
