import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DHT, MnemeProvider } from '@mneme/core-web';
import { useMnemeStore } from '@mneme/desktop/store';
import { LoginSignupPage } from '@mneme/desktop/ui/page/LoginSignup/LoginSignupPage';
import { Page } from '@mneme/desktop/ui/core/Page/Page';
import { Dashboard } from '@mneme/desktop/ui/page/Dashboard/DashboardPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  const currentUser = useMnemeStore((state) => state.currentUser);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!currentUser ? (
          <Stack.Screen name="LoginSignup" component={LoginSignupPage} />
        ) : (
          <Stack.Screen name="Dashboard" component={Dashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const Main = () => {
  const queryClient = new QueryClient();

  return (
    <DHT>
      <MnemeProvider>
        <QueryClientProvider client={queryClient}>
          <Page>
            <AppRouter />
          </Page>
        </QueryClientProvider>
      </MnemeProvider>
    </DHT>
  );
};