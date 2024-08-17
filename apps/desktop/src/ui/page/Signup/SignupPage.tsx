import { Box, Card, HStack, Link, LinkText, Text } from '@mneme/components';

import { SignupForm } from '@mneme/desktop/ui/viewComponents/Signup/SignupForm';
import { useLinkTo } from '@react-navigation/native';

export const SignupPage = () => {
  const linkTo = useLinkTo();
  return (
    <Box w="$full" alignItems="center">
      <Card size="md" variant="elevated" m="$3">
        <SignupForm />
        <HStack mt="$4">
          <Text italic>Or </Text>
          <Link>
            <LinkText italic onPress={() => linkTo('/login')}>
              Login
            </LinkText>
          </Link>
        </HStack>
      </Card>
    </Box>
  );
};
