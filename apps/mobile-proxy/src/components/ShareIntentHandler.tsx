import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useShareIntent } from "expo-share-intent";
import { useEffect } from "react";
import { UrlAnalyser } from "@/lib/modules/Analysis/application/usecases/UrlAnalyser";

type ShareIntent = {
  text?: string | null;
  files?: Array<{ path: string }> | [] | null;
};

const isValidURL = (text: string): string | boolean => {
  try {
    new URL(text);
    return text;
  } catch (err) {
    return false;
  }
}

const handleShareIntent = async (shareIntent: ShareIntent) => {
  if (shareIntent.files) {
    console.log("Files:", shareIntent.files);
    return;
  }

  const url = shareIntent.text && isValidURL(shareIntent.text);

  if (url && typeof url === "string") {
    console.log("Analysing url:", { url });
    const mnemeDocument = await new UrlAnalyser().process(url);
    console.log("Analysed ===========> ", { mnemeDocument });
    return;
  }
};

export const ShareIntentHandler = () => {
  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntent({
      debug: true,
      resetOnBackground: true,
    });

  useEffect(() => {
    if (hasShareIntent) {
      console.log("Share Intent Found! TODO: Send this to the server.");
      console.log(shareIntent);

      handleShareIntent(shareIntent);
    }
  }, [hasShareIntent, shareIntent]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icon.png")}
        style={[styles.logo, styles.gap]}
      />
      <Text style={[styles.gap, { fontWeight: "bold" }]}>
        {hasShareIntent ? "SHARE INTENT FOUND !" : "NO SHARE INTENT DETECTED"}
      </Text>
      {!!shareIntent.text && <Text style={styles.gap}>{shareIntent.text}</Text>}
      {shareIntent?.files?.map((file) => (
        <Image
          key={file.path}
          source={{ uri: file.path }}
          style={[styles.image, styles.gap]}
        />
      ))}
      {!!shareIntent && (
        <Button
          onPress={() => resetShareIntent()}
          title="Reset"
        />
      )}
      <Text style={[styles.error]}>{error}</Text>
    </View>
  );
};

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
