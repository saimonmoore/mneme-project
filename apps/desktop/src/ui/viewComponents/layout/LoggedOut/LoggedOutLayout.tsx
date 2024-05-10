import {
  Link,
  VStack,
  Heading,
  LinkText,
  Icon,
  HStack,
  HelpCircleIcon,
  ThemeSwitcher,
} from "@mneme/components";
import { Header } from "@mneme/desktop/ui/viewComponents/Header/Header";

export const LoggedOutLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <VStack space="md">
      <Header>
        <Header.Left>?</Header.Left>
        <Header.Center>
          <Heading>Welcome to Mneme</Heading>
        </Header.Center>
        <Header.Right>
          <HStack>
            <Link>
              <LinkText>
                <Icon as={HelpCircleIcon} m="$2" w="$4" h="$4" />
              </LinkText>
            </Link>
            <ThemeSwitcher />
          </HStack>
        </Header.Right>
      </Header>
      {children}
    </VStack>
  );
};
