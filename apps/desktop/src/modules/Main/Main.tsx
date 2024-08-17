import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DHT, MnemeProvider } from '@mneme/core-web';
import { useMnemeStore } from '@mneme/desktop/store';
import { LoginPage } from '@mneme/desktop/ui/page/Login/LoginPage';
import { SignupPage } from '@mneme/desktop/ui/page/Signup/SignupPage';
import { Page } from '@mneme/desktop/ui/core/Page/Page';
import { Dashboard } from '@mneme/desktop/ui/page/Dashboard/DashboardPage';
import { RecordByKeywordsPage } from '@mneme/desktop/ui/page/RecordsByKeyword/RecordByKeywordsPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  const currentUser = useMnemeStore((state) => state.currentUser);

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Login: '/login',
        Signup: '/signup',
        Dashboard: '/dashboard',
        RecordsByKeyword: '/keywords/:label',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {!currentUser ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Signup" component={SignupPage} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen
              name="RecordsByKeyword"
              component={RecordByKeywordsPage}
            />
          </Stack.Group>
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
