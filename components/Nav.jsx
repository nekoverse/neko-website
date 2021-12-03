import { Fragment } from 'react'

import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faTelegramPlane, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover, Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import useEtherSWR from 'ether-swr'

import Link from 'next/link'

import { useContractAddresses, useContracts } from '../hooks/evm'
import { formatNekoBillions } from '../lib/evm'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Balance({ }) {
  const { account } = useWeb3React()
  const { neko: nekoAddr } = useContractAddresses()
  const { data } = useEtherSWR(account ? [
    [nekoAddr, 'balanceOf', account]
  ] : [])
  const [balance] = data || []
  return (
    <div className="flex flex-col md:flex-row">{balance && (
      <>
        <span>{Math.floor(formatNekoBillions(balance))}<span className="font-bold text-xs mx-0.5">B</span></span>
        <span className="md:ml-2">NEKO</span>
      </>
    )}</div>
  )
}

export default function Nav() {
  const { active } = useWeb3React()

  return (
    <header className="flex flex-row p-4 justify-between sticky top-0 z-50">
      <div>
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
                      <Link href="/#vision"><a className="fs-normal menu-item">Vision</a></Link>
                      <Link href="/#lottery"><a className="fs-normal menu-item">Lotto</a></Link>
                      <Link href="/#characters"><a className="fs-normal menu-item">Characters</a></Link>
                      <Link href="/#art"><a className="fs-normal menu-item">Art</a></Link>
                      <Link href="/auction"><a className="fs-normal menu-item">Auction</a></Link>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        {/* hide i18n for now but keep item there for positioning purposes
              <a className="nav-link dropdown-toggle fs-smaller" href="#" id="navbarDropdownMenuLink78" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="flag-icon flag-icon-us text-2xl"></span></a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink78">
        <a className="dropdown-item" href="index.html"><span className="flag-icon flag-icon-us text-2xl"></span> English</a>
        <a className="dropdown-item" href="index.zh.html"><span className="flag-icon flag-icon-cn text-2xl"></span> 汉语</a>
        <a className="dropdown-item" href="index.ru.html"><span className="flag-icon flag-icon-ru text-2xl"></span> Русский</a>
      </div>
     */}
      </div>
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
        {active && (<Balance />)}
      </div>

    </header>
  )
}