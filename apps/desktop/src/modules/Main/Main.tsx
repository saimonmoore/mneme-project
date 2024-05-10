import { Heading } from "@mneme/components";
import { useMnemeStore } from "@mneme/desktop/store";
import { LoggedInLayout } from "@mneme/desktop/ui/viewComponents/layout/LoggedIn/LoggedInLayout";
import { LoggedOutLayout } from "@mneme/desktop/ui/viewComponents/layout/LoggedOut/LoggedOutLayout";
import { LoginView } from "@mneme/desktop/ui/page/Login/Login";
import { Page } from "@mneme/desktop/ui/core/Page/Page";
import { Dashboard } from "@mneme/desktop/ui/page/Dashboard/Dashboard";

export const Main = () => {
  const currentUser = useMnemeStore((state) => state.currentUser);
  return (
    <Page>
      {!currentUser && <LoggedOutLayout>{<LoginView />}</LoggedOutLayout>}
      {currentUser && (
        <LoggedInLayout>
          <Heading>Dashboard</Heading>
          <Dashboard />
        </LoggedInLayout>
      )}
    </Page>
  );
};
