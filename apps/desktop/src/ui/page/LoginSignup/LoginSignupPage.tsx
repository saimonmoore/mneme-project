import { useState } from "react";

import { Box, Card, HStack, Link, LinkText, Text } from "@mneme/components";

import { LoginForm } from "@mneme/desktop/ui/viewComponents/Login/LoginForm";
import { SignupForm } from "@mneme/desktop/ui/viewComponents/Signup/SignupForm";

export const LoginSignupPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <Box w="$full" alignItems="center">
      <Card size="md" variant="elevated" m="$3">
        {!showSignup && (
          <>
            <LoginForm />
            <HStack mt="$4">
              <Text italic>Or </Text>
              <Link>
                <LinkText italic onPress={() => setShowSignup(!showSignup)}>
                  Signup
                </LinkText>
              </Link>
            </HStack>
          </>
        )}
        {showSignup && (
          <>
            <SignupForm />
            <HStack mt="$4">
              <Text italic>Or </Text>
              <Link>
                <LinkText italic onPress={() => setShowSignup(!showSignup)}>
                  Login
                </LinkText>
              </Link>
            </HStack>
          </>
        )}
      </Card>
    </Box>
  );
};
