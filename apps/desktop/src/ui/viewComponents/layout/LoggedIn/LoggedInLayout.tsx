import {
  Link,
  HStack,
  VStack,
  Heading,
  LinkText,
  ThemeSwitcher,
  HelpCircleIcon,
  Icon,
} from "@mneme/components";
import { useMnemeStore } from "@mneme/desktop/store";
import { Header } from "@mneme/desktop/ui/viewComponents/Header/Header";

export const LoggedInLayout = ({ children }: { children: React.ReactNode }) => {
  const logout = useMnemeStore((state) => state.logout);

  return (
    <VStack space="md">
      <Header>
        <Header.Left>
          <Icon as={HelpCircleIcon} m="$2" w="$4" h="$4" />
        </Header.Left>
        <Header.Center>
          <Heading>Mneme</Heading>
        </Header.Center>
        <Header.Right>
          <HStack>
            <Link onPress={() => logout()}>
              <LinkText>Logout</LinkText>
            </Link>
            <ThemeSwitcher />
          </HStack>
        </Header.Right>
      </Header>
      {children}
    </VStack>
  );
};
