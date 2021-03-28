import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container, Box, Link, HStack, Button, Text } from "@chakra-ui/react";
import useWeb3Modal from "../hooks/useWeb3Modal";
import useAccount from "../hooks/useAccount";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

const Layout = ({ children }) => {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const { myAccount, balance } = useAccount();

  return (
    <>
      <Box minW="100%" p="4">
        <HStack justifyContent="space-between">
          <HStack spacing="6">
            <Link as={RouterLink} to="/">
              Home
            </Link>
            <Link as={RouterLink} to="/vouch">
              Vouch
            </Link>
            <Link as={RouterLink} to="/event">
              Manage event
            </Link>
            <Link as={RouterLink} to="/verify">
              Verify
            </Link>
            <Link as={RouterLink} to="/admin">
              Admin
            </Link>
          </HStack>
          <HStack spacing="6">
            {provider ? (
              <>
                <Box>
                  <Text isTruncated maxW="20vw">
                    {myAccount}
                  </Text>
                </Box>
                <Box>
                  <Text>Balance: {balance} ETH</Text>
                </Box>
              </>
            ) : (
              undefined
            )}

            <WalletButton
              provider={provider}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          </HStack>
        </HStack>
      </Box>
      <Container p={4}>{children}</Container>
    </>
  );
};

export default Layout;
