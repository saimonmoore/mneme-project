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
  useToast,
} from "@mneme/components";

import { User } from "@mneme/desktop/domain/User/User";
import { Login, LoginError } from "@mneme/desktop/domain/Login/Login";
import { useMnemeStore } from "@mneme/desktop/store";

import { FieldWrapper } from "./LoginForm.styles";
import { Errors } from "@mneme/desktop/ui/viewComponents/Errors/Errors";
import {
  Notification,
  NotificationType,
} from "@mneme/desktop/ui/viewComponents/Notification/Notification";
import { useLogin } from "@mneme/desktop/application/Session/SessionUseCase";

export const LoginForm = () => {
  const toast = useToast();
  const setCurrentUser = useMnemeStore((state) => state.login);
  const [errors, setErrors] = useState<LoginError>({} as LoginError);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<Login>(
    Login.create({ email: "", password: "" })
  );

  const { login: doLogin, data, loading, error } = useLogin();

  const loginUser = () => {
    if (!login) return;

    doLogin(login);
  };

  useEffect(() => {
    async function validateLogin() {
      if (!login) return;

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

  useEffect(() => {
    if (data) {
      const loginInputDto = data as Login;

      const newUser = User.create({
        email: loginInputDto.email,
        password: loginInputDto.password,
        passwordConfirmation: loginInputDto.password,
        userName: "excsm",
        displayName: "Saimon",
        avatarUrl: "Saimon",
      });

      setCurrentUser(newUser);
    }

    if (error) {
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="Login failed"
            description={`There was an error logging in! (${error.message})`}
          />
        ),
      });
    }
  }, [data, error]);

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
          <ButtonText mr="$2">Login</ButtonText>
          <Spinner loading={loading} >
            <Icon as={ArrowRightIcon} />
          </Spinner>
        </Button>
      )}
    </VStack>
  );
};
