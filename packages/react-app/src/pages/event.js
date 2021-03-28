import React, { useEffect } from "react";
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
} from "@chakra-ui/react";
import web3 from "web3";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import { eventState } from "../store/event";
import { addresses, abis } from "@project/contracts";

const ActiveEventCard = ({ eventId, vouchFor, amount, endDate }) => {
  return (
    <>
      <Box boxShadow="md" rounded="md" padding={4} minW="100%">
        <VStack align="flex-start">
          <Box>
            <Text as="b">Event id:</Text> {eventId}
          </Box>
          {/* <Box>
            <Text as="b">You vouch for:</Text> {vouchFor}
          </Box> */}
          {/* <Button>Claim!</Button> */}
        </VStack>
      </Box>
    </>
  );
};

const Event = () => {
  const eventManagerContract = useContract(
    addresses.eventManager,
    abis.eventManager
  );
  const eventContract = useContract(addresses.event, abis.event);
  const [event, setEvent] = useRecoilState(eventState);
  const { myAccount, balance } = useAccount();
  const { handleSubmit, register } = useForm();

  useEffect(() => {
    if (eventManagerContract && myAccount) {
      eventManagerContract.methods
        .getEventOwnertoEventAddrs(myAccount)
        .call()
        .then((res) => {
          setEvent(res);
        });
    }
  }, [eventManagerContract, myAccount, setEvent]);

  const handleFormSubmit = (values) => {
    const { name, eventDate, description, capacity, stakedValue } = values;
    eventManagerContract.methods
      .addEvent(name, eventDate, description, capacity)
      .send({
        from: myAccount,
        value: web3.utils.toWei(stakedValue, "ether").toString(), // 0.1 eth
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack spacing={4} align="flex-start" marginBottom={8}>
          <Heading>Your active event</Heading>
          {event &&
            event.map((each) => {
              return <ActiveEventCard key={each} eventId={each} />;
            })}
        </VStack>
        <VStack spacing={4} align="flex-start">
          <Heading>Create event</Heading>
          <Box>
            <FormLabel>Name</FormLabel>
            <Input name="name" ref={register} />
          </Box>
          <Box>
            <FormLabel>Event date</FormLabel>
            <Input name="eventDate" ref={register} defaultValue={1617055967} />
          </Box>
          <Box>
            <FormLabel>Event capacity</FormLabel>
            <Input name="capacity" ref={register} />
          </Box>
          <Box>
            <FormLabel>Description</FormLabel>
            <Input name="description" ref={register} />
          </Box>
          <Box>
            <FormLabel>Stake</FormLabel>
            <InputGroup>
              <Input name="stakedValue" ref={register} />
              <InputRightElement children="ETH" />
            </InputGroup>
          </Box>
          <Button type="submit">Create event</Button>
        </VStack>
      </form>
    </>
  );
};

export default Event;
