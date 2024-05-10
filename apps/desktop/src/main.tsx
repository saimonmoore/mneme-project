import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { AppRegistry } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { StyledProvider } from "@gluestack-style/react";
import { config } from "@gluestack-ui/config";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import { Main } from "@mneme/desktop/modules/Main/Main";
import { theme, useMnemeUIStore } from "@mneme/components";

import "./index.native.css";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const Root = () => {
  const colourMode = useMnemeUIStore((state) => state.currentColourMode) || theme.DEFAULT_COLOR_MODE;

  return (
    <React.StrictMode>
      {/* top SafeAreaView */}
      <SafeAreaView
        style={{
          backgroundColor: colourMode === "light" ? "#E5E5E5" : "#262626",
        }}
      />
      {/* bottom SafeAreaView */}
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: colourMode === "light" ? "white" : "#171717",
        }}
      >
        <StyledProvider config={config} colorMode={colourMode as COLORMODES}>
          <GluestackUIProvider
            config={config}
            colorMode={colourMode as COLORMODES}
          >
            <Main />
          </GluestackUIProvider>
        </StyledProvider>
      </SafeAreaView>
    </React.StrictMode>
  );
};

const rootTag = document.getElementById("root");
AppRegistry.registerComponent("Root", () => Root);
AppRegistry.runApplication("Root", { rootTag });

// ReactDOM.createRoot(document.getElementById('root')!).render()
