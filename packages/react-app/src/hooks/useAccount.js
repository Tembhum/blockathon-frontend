import { useState, useEffect, useCallback } from "react";
import web3 from "web3";

export default function useAccounts() {
  const provider = new web3(window.ethereum);
  const [accounts, setAccounts] = useState([]);
  const [myAccount, setMyAccount] = useState();
  const [balance, setBalance] = useState();
  const fetch = useCallback(async () => {
    if (!provider) return;
    const accs = await provider.eth.getAccounts();
    setAccounts(accs);
    const acc = accs[0];
    if (acc) {
      setMyAccount(acc);
      const result = await provider.eth.getBalance(acc);
      setBalance(provider.utils.fromWei(result));
    }
  }, []);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return {
    accounts,
    myAccount,
    balance,
  };
}
