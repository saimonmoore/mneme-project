import React from "react";
import { useState } from "react";
import { AppRegistry } from "react-native";
// import ReactDOM from "react-dom/client";
import "./index.native.css";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { StyledProvider } from "@gluestack-style/react";

import { Box, Button, VStack, Heading, ButtonText } from "@mneme/components";

import { Page } from "./ui/core/Page/Page";
import { LoginView } from "./view/Login/Login";
// import { MnemeTheme } from "./ui/theme";
import { useMnemeStore } from "./store";

const LoggedOutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <VStack space="md">
      <Heading>Welcome to Mneme</Heading>
      {children}
    </VStack>
  );
};

const LoggedInLayout = ({ children }: { children: React.ReactNode }) => {
  const logout = useMnemeStore((state) => state.logout);

  return (
    <VStack space="md">
      <Heading>Mneme</Heading>
      {children}
      <Box>
        <Button variant="outline" size="md" onPress={() => logout()}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </Box>
    </VStack>
  );
};

const Main = () => {
  const currentUser = useMnemeStore((state) => state.currentUser);
  console.log("=============> ", { currentUser });
  return (
    <Box>
      {!currentUser && <LoggedOutLayout>{<LoginView />}</LoggedOutLayout>}
      {currentUser && <LoggedInLayout><Heading>Dashboard</Heading></LoggedInLayout>}
    </Box>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const Root = () => (
  <React.StrictMode>
    <StyledProvider config={config}>
      <GluestackUIProvider config={config}>
        <Page>
          <Main />
          <Box>
            <Button
              variant="outline"
              size="md"
              onPress={() => console.log("Hello")}
            >
              <ButtonText>Switch Theme</ButtonText>
            </Button>
          </Box>
        </Page>
      </GluestackUIProvider>
    </StyledProvider>
  </React.StrictMode>
);

const rootTag = document.getElementById("root");
AppRegistry.registerComponent("Root", () => Root);
AppRegistry.runApplication("Root", { rootTag });

// ReactDOM.createRoot(rootTag!).render(<Root />);
