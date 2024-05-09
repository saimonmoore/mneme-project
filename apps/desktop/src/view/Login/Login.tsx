import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  Box,
  Button,
  ButtonText,
  Icon,
  VStack,
  Spinner,
  Input,
  InputField,
  Text,
} from "@mneme/components";

import { Login, LoginError } from "../../domain/Login/Login";

import { EmailWrapper, PasswordWrapper } from "./Login.styles";
// import { useSession } from "../../context/Session";
import { User } from "../../domain/User/User";
import { useMnemeStore } from "../../store";

const Errors = ({ errors }: { errors?: string[] }) => (
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
    <VStack space="md">
      <Box w="$20">
        {
          <EmailWrapper>
            <Input size="md">
              <InputField
                placeholder="Signin with your email"
                value={login.email}
                onChangeText={(newEmail) => setEmail(newEmail)}
              />
            </Input>
          </EmailWrapper>
        }
        {!!email.length && <Errors errors={errors.email} />}
        {!errors.email?.length && (
          <PasswordWrapper>
            <Input size="md">
              <InputField
                type="password"
                placeholder="password"
                value={login.password}
                onChangeText={(newPassword) => setPassword(newPassword)}
              />
            </Input>
          </PasswordWrapper>
        )}
        {!errors.email?.length && !!password.length && (
          <Errors errors={errors.password} />
        )}

        {!errors.email?.length && !errors.password?.length && (
          <Button variant="outline" size="md" onPress={() => loginUser()}>
            <Spinner loading={false}>
              <Icon as={ArrowRightIcon} />
            </Spinner>
            <ButtonText>Login</ButtonText>
          </Button>
        )}
      </Box>
    </VStack>
  );
};
