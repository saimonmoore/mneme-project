import { Box, Text } from "@radix-ui/themes";

export const Errors = ({ errors }: { errors?: string[] }) => (
  <Box>
    {(errors || []).map((error) => (
      <Box as="span" key={error}>
        <Text color="gray" size="1">
          {error}
        </Text>
      </Box>
    ))}
  </Box>
);