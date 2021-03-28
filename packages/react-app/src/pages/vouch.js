import React, { useEffect } from "react";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  VStack,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import web3 from "web3";
import { useRecoilValue, useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import { eventState } from "../store/event";
import { vouchedState } from "../store/vouched";
import { abis, addresses } from "@project/contracts";

const VouchPositionCard = ({ eventAddress, vouchAddress, amount, endDate }) => {
  return (
    <>
      <Box boxShadow="md" rounded="md" padding={4} minW="100%">
        <VStack align="flex-start">
          <Box>
            <Text as="b">You vouch for:</Text> {vouchAddress}
          </Box>
          <Box>
            <Text as="b">Amount:</Text> {amount}
          </Box>
          {/* <Button>Claim!</Button> */}
        </VStack>
      </Box>
    </>
  );
};

const Vouch = () => {
  const { myAccount, balance } = useAccount();
  const { handleSubmit, register, getValues } = useForm();
  const events = useRecoilValue(eventState);
  const [vouched, setVouched] = useRecoilState(vouchedState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // useEffect(() => {
  //   console.log("events", events);
  //   const provider = new web3(window.ethereum);
  //   events.forEach((eventAddress) => {
  //     const contract = new provider.eth.Contract(abis.event, eventAddress);
  //     contract.methods
  //       .getStakedArray()
  //       .call()
  //       .then(console.log);
  //   });
  // }, [events]);

  const handleFormClickSubmit = () => {
    onOpen();
  };

  const handleFormSubmit = () => {
    const { eventAddress, vouchAddress, amount } = getValues([
      "eventAddress",
      "vouchAddress",
      "amount",
    ]);
    const provider = new web3(window.ethereum);
    const contract = new provider.eth.Contract(abis.event, eventAddress);
    contract.methods
      .stake(vouchAddress)
      .send({
        from: myAccount,
        value: web3.utils.toWei(amount, "ether").toString(), // 0.1 eth
      })
      .then(() => {
        setVouched(vouched.concat([{ address: vouchAddress, locked: 0.1 }]));
        onClose();
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormClickSubmit)}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm vouch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="flex-start">
                <Box>Event address: {getValues("eventAddress")}</Box>
                <Box>You vouch for: {getValues("vouchAddress")}</Box>
                <Box>Amount: {getValues("amount")}</Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" onClick={handleFormSubmit}>
                Confirm vouch
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <VStack spacing={4} align="flex-start" marginBottom={8}>
          <Heading>Your vouch position</Heading>
          {vouched &&
            vouched.map((each) => {
              return (
                <VouchPositionCard
                  key={each.address}
                  vouchAddress={each.address}
                  amount={each.locked}
                />
              );
            })}
        </VStack>
        <VStack spacing={4} align="flex-start">
          <Heading>Vouch</Heading>
          <Box>
            <FormLabel>Event address</FormLabel>
            <Input name="eventAddress" ref={register} />
          </Box>
          <Box>
            <FormLabel>Vouch for</FormLabel>
            <Input name="vouchAddress" ref={register} />
          </Box>
          <Box>
            <FormLabel>Amount</FormLabel>
            <Input name="amount" ref={register} />
          </Box>
          <Button type="submit">Vouch!</Button>
        </VStack>
      </form>
    </>
  );
};

export default Vouch;
