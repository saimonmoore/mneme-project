import { useEffect, useState } from 'react';

import { Box, useToast, VStack, useBreakpointValue, Heading } from '@mneme/components';
import {
  Notification,
  NotificationType,
} from '@mneme/desktop/ui/viewComponents/Notification/Notification';
import { RecordList } from '@mneme/desktop/ui/viewComponents/Record/RecordList';
import { Record } from '@mneme/desktop/domain/Record/Record';
import { useFindRecordsByKeyword } from '@mneme/desktop/usecases/Record/RecordUseCase';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';

// import { useMnemeStore } from '@mneme/desktop/store';

export const MyRecordsByKeyword = ({ keyword }: { keyword: Keyword }) => {
  const toast = useToast();
  const [searchResults, setSearchResults] = useState<Record[]>([]);

  // const records = useMnemeStore((state) => state.records);
  // const addRecordToStore = useMnemeStore((state) => state.addRecord);

  const {
    executeQuery: findRecordsByKeyword,
    data,
    loading: searchLoading,
    error,
  } = useFindRecordsByKeyword(keyword);

  const containerWidth = useBreakpointValue({
    base: '$full',
    sm: '$full',
    md: '$3/4',
    lg: '$2/3',
    xl: '$1/2',
  });

  console.log('[MyRecordsByKeyword] keyword: ', { keyword, data, searchLoading, error });

  // Trigger the search when the component mounts
  useEffect(() => {
    findRecordsByKeyword();
  }, [keyword]);

  useEffect(() => {
    if (data) {
      setSearchResults(data as unknown as Record[]);
    }

    if (error) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="No records found"
            description={`There was an error looking for your records! (${error.message})`}
          />
        ),
      });

      console.error('Error listing records: ', error);
    }
  }, [data, error]);

  return (
    <Box w="$full" alignItems="center">
      <VStack w={containerWidth} space="md" px="$4">
        <Heading>All "{keyword?.label}" Records</Heading>
        <RecordList records={searchResults} loading={searchLoading} />
      </VStack>
    </Box>
  );
};
