import { useEffect, useState } from "react";
import { Box, Button, Flex, Spinner, TextField, Text } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Login, LoginError } from "../../domain/Login/Login";

import { EmailWrapper, PasswordWrapper } from "./Login.styles";
// import { useSession } from "../../context/Session";
import { User } from "../../domain/User/User";
import { useMnemeStore } from "../../store";

const Errors = ({ errors }: { errors?: string[] }) => (
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

export const LoginView = () => {
  const setCurrentUser = useMnemeStore((state) => state.login);
  const [errors, setErrors] = useState<LoginError>({} as LoginError);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<Login>(
    Login.create({ email: "", password: "" })
  );

  const loginUser = () => {
    // TODO: call API to login
    const user = User.create({
      email: login.email,
      password: login.password,
      userName: "excsm",
      displayName: "Saimon",
      avatarUrl: "Saimon",
    });

    setCurrentUser(user);
  };

  useEffect(() => {
    async function validateLogin() {
      login.email = email;
      login.password = password;

      const errors = await login.validate();
      if (errors) {
        setErrors(errors);
      }

      setLogin(login);
    }

    validateLogin();
  }, [email, password]);

  return (
    <Flex gap="2" direction="column" align="center">
      <Box minWidth="60px">
        {
          <EmailWrapper>
            <TextField.Root
              placeholder="Signin with your email"
              value={login.email}
              onChange={(e) => setEmail(e.target.value)}
              size="3"
            />
          </EmailWrapper>
        }
        {!!email.length && <Errors errors={errors.email} />}
        {!errors.email?.length && (
          <PasswordWrapper>
            <TextField.Root
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setPassword(e.target.value)}
              size="3"
            />
          </PasswordWrapper>
        )}
        {!errors.email?.length && !!password.length && (
          <Errors errors={errors.password} />
        )}

        {!errors.email?.length && !errors.password?.length && (
          <Button variant="soft" size="3" onClick={() => loginUser()}>
            <Spinner loading={false}>
              <ArrowRightIcon />
            </Spinner>
            Login
          </Button>
        )}
      </Box>
    </Flex>
  );
};
