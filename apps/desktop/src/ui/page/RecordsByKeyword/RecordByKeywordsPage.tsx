import {
  Box,
  Heading,
} from "@mneme/components";

import { RouteProp, useRoute } from '@react-navigation/native';

type RouteParams = {
  label: string;
};

export const RecordByKeywordsPage = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const keyword = route.params?.label;

  return (
    <Box w="$full" alignItems="center">
      <Heading>{keyword}</Heading>
    </Box>
  );
};