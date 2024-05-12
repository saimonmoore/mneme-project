import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useMnemeStore } from "@mneme/desktop/store";
import { LoggedInLayout } from "@mneme/desktop/ui/viewComponents/layout/LoggedIn/LoggedInLayout";
import { LoggedOutLayout } from "@mneme/desktop/ui/viewComponents/layout/LoggedOut/LoggedOutLayout";
import { LoginSignupPage } from "@mneme/desktop/ui/page/LoginSignup/LoginSignupPage";
import { Page } from "@mneme/desktop/ui/core/Page/Page";
import { Dashboard } from "@mneme/desktop/ui/page/Dashboard/DashboardPage";

export const Main = () => {
  const queryClient = new QueryClient();
  const currentUser = useMnemeStore((state) => state.currentUser);
  return (
    <QueryClientProvider client={queryClient}>
      <Page>
        {!currentUser && <LoggedOutLayout>{<LoginSignupPage />}</LoggedOutLayout>}
        {currentUser && (
          <LoggedInLayout>
            <Dashboard />
          </LoggedInLayout>
        )}
      </Page>
    </QueryClientProvider>
  );
};
