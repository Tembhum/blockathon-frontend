import React from "react";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import web3 from "web3";
import { useForm } from "react-hook-form";
import useAccount from "../hooks/useAccount";
import { abis, addresses } from "@project/contracts";

const Verify = () => {
  const { handleSubmit, register } = useForm();
  const { myAccount } = useAccount();
  const toast = useToast();

  const handleFormSubmit = (values) => {
    const provider = new web3(window.ethereum);
    const contract = new provider.eth.Contract(abis.event, values.eventAddress);
    contract.methods
      .verify()
      .call({ from: myAccount })
      .then((res) => {
        if (res) {
          toast({
            title: "Welcome to event",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "You are not allowed",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack spacing={4} align="flex-start">
          <Heading>Verify</Heading>
          <Box>
            <FormLabel>Event address</FormLabel>
            <Input name="eventAddress" ref={register} />
          </Box>
          <Box>
            <FormLabel>My address</FormLabel>
            <Text>{myAccount}</Text>
          </Box>
          <Button type="submit">Verify eliglibility</Button>
        </VStack>
      </form>
    </>
  );
};

export default Verify;
