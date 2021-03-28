import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import Web3 from "web3";
import { providerState } from "../store/provider";

export default function useProvider() {
  const [provider, setProvider] = useRecoilState(providerState);

  const initProvider = useCallback(async () => {
    if (window.ethereum) {
      // const tmpWeb3 = new Web3(window.ethereum);
      // setProvider({ ...tmpWeb3 });
      // try {
      //   const result = await window.ethereum.enable();
      //   console.log("result", result);
      //   setProvider(tmpWeb3);
      // } catch (err) {
      //   console.log(err);
      // }
    }
  }, [setProvider]);

  useEffect(() => {
    initProvider();
  }, [initProvider]);

  return provider;
}
