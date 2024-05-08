import { useEffect, useState } from "react";
import { Box, Button, Flex, Spinner, TextField } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { useMnemeStore } from "../../store";
import { User, UserError } from "../../domain/User/User";
import { EmailWrapper, PasswordWrapper } from "./Signup.styles";
import { Errors } from "../../ui/viewComponents/Errors/Errors";

export const SignupView = () => {
  const setCurrentUser = useMnemeStore((state) => state.login);
  const [errors, setErrors] = useState<UserError>({} as UserError);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User | undefined>();

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
      user.encyptedPassword = password;

      const errors = await user.validate();
      if (errors) {
        setErrors(errors);
      }

      setUser(user);
    }

    validateUser();
  }, [email, password]);

  return (
    <Flex gap="2" direction="column" align="center">
      <Box minWidth="60px">
        {
          <EmailWrapper>
            <TextField.Root
              placeholder="Signin with your email"
              value={user?.email}
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
              value={user?.password}
              onChange={(e) => setPassword(e.target.value)}
              size="3"
            />
          </PasswordWrapper>
        )}
        {!errors.email?.length && !!password.length && (
          <Errors errors={errors.password} />
        )}

        {!errors.email?.length && !errors.password?.length && (
          <Button variant="soft" size="3" onClick={() => signupUser()}>
            <Spinner loading={false}>
              <ArrowRightIcon />
            </Spinner>
            Signup
          </Button>
        )}
      </Box>
    </Flex>
  );
};
