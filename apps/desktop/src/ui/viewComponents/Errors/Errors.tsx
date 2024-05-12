import {
  Box,
  Text,
} from "@mneme/components";

export const Errors = ({ errors }: { errors?: string[] }) => (
  <Box>
    {(errors || []).map((error) => (
      <Box as="span" key={error}>
        <Text color="gray" size="md">
          {error}
        </Text>
      </Box>
    ))}
  </Box>
);