import {
  Box,
} from "@mneme/components";

import { RecordList } from "@mneme/desktop/ui/viewComponents/Record/RecordList";

export const Dashboard = () => {

  return (
    <Box w="$full" alignItems="center">
      <RecordList />
    </Box>
  );
};
