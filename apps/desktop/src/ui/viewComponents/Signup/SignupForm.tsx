import { useEffect, useState } from "react";

import {
  ArrowRightIcon,
  Button,
  Heading,
  Icon,
  Input,
  InputField,
  Spinner,
  VStack,
} from "@mneme/components";

import { useMnemeStore } from "@mneme/desktop/store";
import { User, UserError } from "@mneme/desktop/domain/User/User";
import { FieldWrapper } from "./SignupForm.styles";
import { Errors } from "@mneme/desktop/ui/viewComponents/Errors/Errors";
import { ButtonText } from "@gluestack-ui/themed";

export const SignupForm = () => {
  const setCurrentUser = useMnemeStore((state) => state.login);
  const [errors, setErrors] = useState<UserError>({} as UserError);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passswordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(
    User.create({
      email: "",
      userName: "",
      displayName: "",
      password: "",
      passwordConfirmation: "",
      avatarUrl: "",
    })
  );

  const signupUser = () => {
    if (!user) return;

    // TODO: Allow password on user
    // TODO: Finish user form
    // TODO: call usecase to signup
    // TODO: Autocreate zustand selectors
    // TODO: Setup zustand subscriptions
    const newUser = User.create({
      email: user.email,
      password: user.password,
      passwordConfirmation: user.passwordConfirmation,
      userName: "excsm",
      displayName: "Saimon",
      avatarUrl: "Saimon",
    });

    setCurrentUser(newUser);
  };

  useEffect(() => {
    async function validateUser() {
      if (!user) return;

      user.email = email;
      user.userName = userName;
      user.displayName = displayName;
      user.avatarUrl = avatarUrl;
      user.password = password;
      user.passwordConfirmation = passswordConfirmation;
      user.encyptedPassword = password;

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
    avatarUrl,
  ]);

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

      {
        <FieldWrapper>
          <Input size="md">
            <InputField
              placeholder="Upload your avatar"
              value={user?.avatarUrl}
              onChangeText={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
            />
          </Input>
        </FieldWrapper>
      }
      {!!email.length && <Errors errors={errors.email} />}

      {!errors.email?.length && !errors.password?.length && (
        <Button variant="outline" size="md" onPress={() => signupUser()}>
          <Spinner loading={false}>
            <Icon as={ArrowRightIcon} />
          </Spinner>
          <ButtonText>Signup</ButtonText>
        </Button>
      )}
    </VStack>
  );
};
