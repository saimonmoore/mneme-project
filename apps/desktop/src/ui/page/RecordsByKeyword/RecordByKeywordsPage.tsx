import {
  Box,
  Heading,
} from "@mneme/components";
import { LoggedInLayout } from '@mneme/desktop/ui/viewComponents/layout/LoggedIn/LoggedInLayout';

import { RouteProp, useRoute } from '@react-navigation/native';

type RouteParams = {
  label: string;
};

export const RecordByKeywordsPage = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const keyword = route.params?.label;

  return (
    <LoggedInLayout>
      <Box w="$full" alignItems="center">
        <Heading>{keyword}</Heading>
      </Box>
    </LoggedInLayout>
  );
};