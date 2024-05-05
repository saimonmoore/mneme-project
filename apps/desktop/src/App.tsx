import { useState } from "react";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

import viteLogo from "/vite.svg";
import { Page } from "./ui/core/Page/Page";
import { Login } from "./view/Login/Login";

type MnemeTheme = "light" | "dark";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<MnemeTheme>("light");

  // const theme = MnemeTheme[currentTheme as keyof typeof MnemeTheme];

  return (
    <Theme appearance={currentTheme} accentColor="indigo">
      <ThemePanel />
      <Page>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
        </div>
        {loggedIn ? <p>Welcome back!</p> : <Login />}
        <div className="card">
          <button onClick={() => setLoggedIn(!loggedIn)}>
            {loggedIn ? "Logout" : "Login"}
          </button>
          <button
            onClick={() =>
              setCurrentTheme(currentTheme === "light" ? "dark" : "light")
            }
          >
            {currentTheme === "light" ? "dark" : "light"}
          </button>
        </div>
      </Page>
    </Theme>
  );
}

export default App;
