import { useContext, createContext, useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'


const ProviderDetectorContext = createContext({});
export default ProviderDetectorContext;

const { Provider } = ProviderDetectorContext;

export function ProviderDetectorProvider(props) {
  const [web3Provider, setWeb3Provider] = useState()
  const [hasWeb3Provider, setHasWeb3Provider] = useState()

  useEffect(function () {
    detectEthereumProvider().then(p => {
      setWeb3Provider(p);
      setHasWeb3Provider(!!p);
    })
  }, [])
  return (<Provider value={{ web3Provider, hasWeb3Provider }} {...props} />)
}

export function useHasWeb3Provider() {
  const { hasWeb3Provider } = useContext(ProviderDetectorContext);
  return hasWeb3Provider;
}