import { HStack, Box } from "@mneme/components";

export const Header = ({ children }: { children: React.ReactNode }) => (
  <Box w="$full">
    <HStack mt="$5" justifyContent="space-between">
      {children}
    </HStack>
  </Box>
);

Header.Left = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      w: 100,
      h: 100,
    }}
  >
    {children}
  </Box>
);

Header.Center = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      w: 300,
      h: 100,
    }}
  >
    {children}
  </Box>
);

Header.Right = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      w: 200,
      h: 100,
    }}
  >
    <Box>
      {children}
    </Box>
  </Box>
);
