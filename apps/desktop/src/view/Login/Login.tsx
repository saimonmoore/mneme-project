import { Box, Grid, TextField } from "@radix-ui/themes";

export const Login = () => {
  return (
    <Grid columns="1" gap="3" rows="2">
      <Box maxWidth="200px">
        <TextField.Root size="1" placeholder="Signin with your email" />
      </Box>
    </Grid>
  );
};
