import "reflect-metadata";
import { useState } from "react";
import { ThemeProvider } from "styled-components";

import "@radix-ui/themes/styles.css";
import {
  Box,
  Button,
  Flex,
  Heading,
  Theme,
  ThemePanel,
} from "@radix-ui/themes";

import viteLogo from "/vite.svg";
import { Page } from "./ui/core/Page/Page";
import { LoginView } from "./view/Login/Login";
import { MnemeTheme } from "./ui/theme";
import { SessionProvider, useSession } from "./context/Session";

type MnemeTheme = "light" | "dark";

const MnemeThemeProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("=============> ", { MnemeTheme });
  return <ThemeProvider theme={MnemeTheme}>{children}</ThemeProvider>;
};

const LoggedOutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex direction="column" align="center" gap="4">
      <Heading>Welcome to Mneme</Heading>
      {children}
    </Flex>
  );
};

const LoggedInLayout = ({ children }: { children: React.ReactNode }) => {
  const setCurrentUser = useSession().setCurrentUser;

  return (
    <Flex direction="column" align="center">
      <Heading>Mneme</Heading>
      {children}
      <Box>
        <Button variant="soft" size="2" onClick={() => setCurrentUser(undefined)}>
          Logout
        </Button>
      </Box>
    </Flex>
  );
};

const Main = () => {
  const session = useSession();
  console.log("=============> ", { session });
  return (
    <Box>
      <img src={viteLogo} alt="Vite Logo" />
      {!session?.currentUser && (
        <LoggedOutLayout>{<LoginView />}</LoggedOutLayout>
      )}
      {session?.currentUser && <LoggedInLayout>Dashboard</LoggedInLayout>}
    </Box>
  );
};
function App() {
  const [currentTheme, setCurrentTheme] = useState<MnemeTheme>("light");
  // const theme = MnemeTheme[currentTheme as keyof typeof MnemeTheme];

  return (
    <Theme appearance={currentTheme} accentColor="indigo">
      <ThemePanel />
      <MnemeThemeProvider>
        <SessionProvider>
          <Page>
            <Main />
            <Box>
              <Button
                variant="soft"
                size="2"
                onClick={() =>
                  setCurrentTheme(currentTheme === "light" ? "dark" : "light")
                }
              >
                {currentTheme === "light" ? "dark" : "light"}
              </Button>
            </Box>
          </Page>
        </SessionProvider>
      </MnemeThemeProvider>
    </Theme>
  );
}

export default App;
