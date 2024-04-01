import { StyleSheet } from "react-native";

import { ShareIntentProvider } from "expo-share-intent";
import { ShareIntentHandler } from "@/components/ShareIntentHandler";

export function App() {
  return (
    <ShareIntentProvider>
      <ShareIntentHandler />
    </ShareIntentProvider>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  gap: {
    marginBottom: 20,
  },
  error: {
    color: "red",
  },
});
