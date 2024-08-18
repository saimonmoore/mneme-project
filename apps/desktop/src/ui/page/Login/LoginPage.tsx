import { Box, Card, HStack, Link, LinkText, Text } from '@mneme/components';

import { LoggedOutLayout } from '@mneme/desktop/ui/viewComponents/layout/LoggedOut/LoggedOutLayout';
import { LoginForm } from '@mneme/desktop/ui/viewComponents/Login/LoginForm';
import { useLinkTo } from '@react-navigation/native';

export const LoginPage = () => {
  const linkTo = useLinkTo();

  return (
    <LoggedOutLayout>
      <Box w="$full" alignItems="center">
        <Card size="md" variant="elevated" m="$3">
          <LoginForm />
          <HStack mt="$4">
            <Text italic>Or </Text>
            <Link>
              <LinkText italic onPress={() => linkTo('/signup')}>
                Signup
              </LinkText>
            </Link>
          </HStack>
        </Card>
      </Box>
    </LoggedOutLayout>
  );
};
