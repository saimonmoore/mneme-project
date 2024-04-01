import { StyleSheet, Text, View } from "react-native";
import { TestComponent } from "@mneme/components";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  link: {
    color: "blue",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  text: {
    alignItems: "center",
    fontSize: 24,
    marginBottom: 24,
  },
});

// @ts-expect-error "TODO"
export default function App(props) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.text}>
        React Native for Web & Next.js
      </Text>
      <View style={styles.textContainer}>
        <Text accessibilityRole="header" aria-level="2" style={styles.text}>
          Subheader
        </Text>
        <TestComponent />
      </View>
    </View>
  );
}
