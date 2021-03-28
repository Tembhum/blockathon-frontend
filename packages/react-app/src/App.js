import React from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";
// import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Vouch from "./pages/vouch";
import Event from "./pages/event";
import Admin from "./pages/admin";
import useProvider from "./hooks/useProvider";
import useContract from "./hooks/useContract";
import useAccount from "./hooks/useAccount";
import { eventState } from "./store/event";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";
import Verify from "./pages/verify";
import Home from "./pages/home";

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider();
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const ceaErc20 = new Contract(
    addresses.ceaErc20,
    abis.erc20,
    defaultProvider
  );
  // A pre-defined address that owns some CEAERC20 tokens
  const tokenBalance = await ceaErc20.balanceOf(
    "0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"
  );
  console.log({ tokenBalance: tokenBalance.toString() });
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  useProvider();

  const setEvent = useSetRecoilState(eventState);
  const { myAccount } = useAccount();
  const eventManagerContract = useContract(
    addresses.eventManager,
    abis.eventManager
  );
  React.useEffect(() => {
    if (eventManagerContract && myAccount) {
      eventManagerContract.methods
        .getEventOwnertoEventAddrs(myAccount)
        .call()
        .then((res) => {
          setEvent(res);
        });
    }
  }, [eventManagerContract, myAccount, setEvent]);

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/vouch" component={Vouch} />
        <Route path="/event" component={Event} />
        <Route path="/admin" component={Admin} />
        <Route path="/verify" component={Verify} />
      </Switch>
    </Layout>
  );
}

export default App;
