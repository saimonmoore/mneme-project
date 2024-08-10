import { useEffect, useState } from "react";

import {
  ArrowRightIcon,
  Button,
  ButtonText,
  Heading,
  Icon,
  Input,
  InputField,
  Spinner,
  useToast,
  VStack,
} from "@mneme/components";

import { useMnemeStore } from "@mneme/desktop/store";
import { useSignup } from "@mneme/desktop/usecases/User/UserUseCase";
import { User, UserError } from "@mneme/desktop/domain/User/User";
import { FieldWrapper } from "./SignupForm.styles";
import { Errors } from "@mneme/desktop/ui/viewComponents/Errors/Errors";
import {
  Notification,
  NotificationType,
} from "@mneme/desktop/ui/viewComponents/Notification/Notification";

export const SignupForm = () => {
  const toast = useToast();
  const setCurrentUser = useMnemeStore((state) => state.login);
  const [errors, setErrors] = useState<UserError>({} as UserError);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passswordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(
    User.create({
      email: "",
      userName: "",
      displayName: "",
      password: "",
      passwordConfirmation: "",
    })
  );

  const { signup, data, loading, error } = useSignup();

  const signupUser = () => {
    if (!user) return;

    signup(user);
  };

  useEffect(() => {
    async function validateUser() {
      if (!user) return;

      user.email = email;
      user.userName = userName;
      user.displayName = displayName;
      user.password = password;
      user.passwordConfirmation = passswordConfirmation;

      const errors = await user.validate();
      if (errors) {
        setErrors(errors);
      }

      setUser(user);
    }

    validateUser();
  }, [
    email,
    userName,
    displayName,
    password,
    passswordConfirmation,
  ]);

  useEffect(() => {
    if (data) {
      // TODO: Autocreate zustand selectors
      // TODO: Setup zustand subscriptions
      const newUser = User.create({
        hash: data.hash,
        email: data.email,
        userName: data.userName,
        displayName: data.displayName,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
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
            title="Signup failed"
            description={`There was an error signing up! (${error.message})`}
          />
        ),
      });
    }
  }, [data, error]);

  return (
    <VStack space="md">
      <Heading mb="$1" size="md">
        Signup to Mneme
      </Heading>
      {
        <FieldWrapper>
          <Input size="md">
            <InputField
              placeholder="Your email address"
              value={user?.email}
              onChangeText={(newEmail) => setEmail(newEmail)}
            />
          </Input>
        </FieldWrapper>
      }
      {!!email.length && <Errors errors={errors.email} />}
      {
        <FieldWrapper>
          <Input size="md">
            <InputField
              placeholder="Your username"
              value={user?.userName}
              onChangeText={(newUserName) => setUserName(newUserName)}
            />
          </Input>
        </FieldWrapper>
      }
      {!!userName.length && <Errors errors={errors.userName} />}
      {
        <FieldWrapper>
          <Input size="md">
            <InputField
              placeholder="Your name"
              value={user?.displayName}
              onChangeText={(newDisplayName) => setDisplayName(newDisplayName)}
            />
          </Input>
        </FieldWrapper>
      }
      {!!displayName.length && <Errors errors={errors.displayName} />}

      <FieldWrapper>
        <Input size="md">
          <InputField
            type="password"
            placeholder="Add a secure password!"
            value={user?.password}
            onChangeText={(newPassword) => setPassword(newPassword)}
          />
        </Input>
      </FieldWrapper>
      {!!password.length && <Errors errors={errors.password} />}

      <FieldWrapper>
        <Input size="md">
          <InputField
            type="password"
            placeholder="Confirm you password!"
            value={user?.passwordConfirmation}
            onChangeText={(confirmation) =>
              setPasswordConfirmation(confirmation)
            }
          />
        </Input>
      </FieldWrapper>
      {!!passswordConfirmation.length && (
        <Errors errors={errors.passwordConfirmation} />
      )}

      {!errors.email?.length && !errors.password?.length && (
        <Button variant="outline" size="md" onPress={() => signupUser()}>
          <ButtonText mr="$4">Signup</ButtonText>
          <Spinner loading={loading}>
            <Icon as={ArrowRightIcon} />
          </Spinner>
        </Button>
      )}
    </VStack>
  );
};
