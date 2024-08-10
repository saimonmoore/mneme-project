import { useEffect } from "react";
import {
  Link,
  HStack,
  VStack,
  Heading,
  LinkText,
  ThemeSwitcher,
  HelpCircleIcon,
  Icon,
  useToast,
} from "@mneme/components";
import { useMnemeStore } from "@mneme/desktop/store";
import { useLogout } from "@mneme/desktop/usecases/Session/SessionUseCase";
import { Header } from "@mneme/desktop/ui/viewComponents/Header/Header";
import {
  Notification,
  NotificationType,
} from "@mneme/desktop/ui/viewComponents/Notification/Notification";

export const LoggedInLayout = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();
  const logoutLocally = useMnemeStore((state) => state.logout);

  const { logout: doLogout, data: loggedOutRemotely, error } = useLogout();

  const logoutUser = () => {
    doLogout();
  };

  useEffect(() => {
    if (loggedOutRemotely) {
      logoutLocally();
    }

    if (error) {
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="Logout failed"
            description={`There was an error logging out! (${error.message})`}
          />
        ),
      });
    }
  }, [loggedOutRemotely, error]);

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
            <Link onPress={() => logoutUser()}>
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
