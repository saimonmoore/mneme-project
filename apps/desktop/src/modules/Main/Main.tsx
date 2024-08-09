import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useMnemeStore } from "@mneme/desktop/store";
import { LoggedInLayout } from "@mneme/desktop/ui/viewComponents/layout/LoggedIn/LoggedInLayout";
import { LoggedOutLayout } from "@mneme/desktop/ui/viewComponents/layout/LoggedOut/LoggedOutLayout";
import { LoginSignupPage } from "@mneme/desktop/ui/page/LoginSignup/LoginSignupPage";
import { Page } from "@mneme/desktop/ui/core/Page/Page";
import { Dashboard } from "@mneme/desktop/ui/page/Dashboard/DashboardPage";
import { DHT, useDHT, RAM } from '@mneme/hyper-web';
import { Mneme } from '@mneme/core';
import { useEffect } from "react";

const Dummy = () => {
  const { dht } = useDHT();
  const listeners = [
    {
      event: Mneme.EVENTS.USER_LOGIN, callback: (user: User) => {
        console.log("info: You are now logged in...", { user: user.email });
        console.log();
        console.log(
          "info: Use the following key to synchronise Mneme to your other devices: ",
          this.outOfBandSyncKey
        );
      }
    },
    {
      event: Mneme.EVENTS.MNEME_READY, callback: () => {
        console.log("info: Mneme is ready for business!");
      }
    },
  ];

  useEffect(() => {
    if (!dht) return;
    console.log('=========> GOT DHT', { dht });

    async function startMneme() {
      const mneme = new Mneme(undefined, RAM, undefined, dht, listeners);
      await mneme.start();
      console.log('=========> GOT Mneme', { mneme });
    }

    startMneme();

  }, [dht]);

  return <div>DHT</div>;
}

export const Main = () => {
  const queryClient = new QueryClient();
  const currentUser = useMnemeStore((state) => state.currentUser);
  return (
    <DHT>
      <QueryClientProvider client={queryClient}>
        <Page>
          <Dummy />
          {!currentUser && <LoggedOutLayout>{<LoginSignupPage />}</LoggedOutLayout>}
          {currentUser && (
            <LoggedInLayout>
              <Dashboard />
            </LoggedInLayout>
          )}
        </Page>
      </QueryClientProvider>
    </DHT>
  );
};
