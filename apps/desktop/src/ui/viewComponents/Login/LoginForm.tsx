import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  Button,
  ButtonText,
  Icon,
  VStack,
  Spinner,
  Input,
  InputField,
  Heading,
} from "@mneme/components";

import { User } from "@mneme/desktop/domain/User/User";
import { Login, LoginError } from "@mneme/desktop/domain/Login/Login";
import { useMnemeStore } from "@mneme/desktop/store";

import { FieldWrapper } from "./LoginForm.styles";
import { Errors } from "@mneme/desktop/ui/viewComponents/Errors/Errors";

export const LoginForm = () => {
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
      passwordConfirmation: login.password,
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
      <Heading mb="$1" size="md">
        Login
      </Heading>
      {
        <FieldWrapper>
          <Input size="md">
            <InputField
              placeholder="Signin with your email"
              value={login.email}
              onChangeText={(newEmail) => setEmail(newEmail)}
            />
          </Input>
        </FieldWrapper>
      }
      {!!email.length && <Errors errors={errors.email} />}
      {!errors.email?.length && (
        <FieldWrapper>
          <Input size="md">
            <InputField
              type="password"
              placeholder="password"
              value={login.password}
              onChangeText={(newPassword) => setPassword(newPassword)}
            />
          </Input>
        </FieldWrapper>
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
    </VStack>
  );
};
