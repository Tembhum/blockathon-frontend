import React from "react";
import { VStack, Button } from "@chakra-ui/react";
import { addresses, abis } from "@project/contracts";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";

const Admin = () => {
  const { myAccount, balance } = useAccount();

  const eventManagerContract = useContract(
    addresses.eventManager,
    abis.eventManager
  );

  function handleDailyTrigger() {
    eventManagerContract.methods
      .timerTrigger()
      .send({ from: myAccount })
      .then((res) => console.log(res));
  }
  return (
    <>
      <VStack spacing={4} align="flex-start" marginBottom={8}>
        <Button onClick={handleDailyTrigger}>Fire daily event!</Button>
      </VStack>
    </>
  );
};

export default Admin;
