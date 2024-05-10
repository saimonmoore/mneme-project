import { Box, View } from "@mneme/components";

export const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <View alignItems="center" w="$full">
      <Box w="$full">{children}</Box>
    </View>
  );
};
