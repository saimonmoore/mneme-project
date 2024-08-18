import { useEffect, useState } from 'react';

import { Box, useToast, VStack, useBreakpointValue, Heading } from '@mneme/components';

import {
  Notification,
  NotificationType,
} from '@mneme/desktop/ui/viewComponents/Notification/Notification';

import { RecordSearchBar } from '@mneme/desktop/ui/viewComponents/Record/RecordSearchBar';
import { RecordList } from '@mneme/desktop/ui/viewComponents/Record/RecordList';

import { Record } from '@mneme/desktop/domain/Record/Record';
import { useFindMyRecords } from '@mneme/desktop/usecases/Record/RecordUseCase';
import { useRecords } from '@mneme/desktop/contexts/RecordsContext';

// import { useMnemeStore } from '@mneme/desktop/store';

export const MyRecords = () => {
  const toast = useToast();
  const { searchTerm, setSearchTerm } = useRecords();
  const [searchResults, setSearchResults] = useState<Record[]>([]);

  // const records = useMnemeStore((state) => state.records);
  // const addRecordToStore = useMnemeStore((state) => state.addRecord);

  const {
    executeQuery: findAllMyRecords,
    data,
    loading: searchLoading,
    error,
  } = useFindMyRecords();

  const containerWidth = useBreakpointValue({
    base: '$full',
    sm: '$full',
    md: '$3/4',
    lg: '$2/3',
    xl: '$1/2',
  });

  // TODO: handleSearch takes the search term.
  // When able to do full text search, we'll need to pass in the search term.
  // And select all records or search by term.
  function handleSearch(_searchTerm?: string) {
    findAllMyRecords();
  }

  function handleRecordAdded(_record?: Record) {
    findAllMyRecords();
  }

  // Trigger the search when the search term changes
  useEffect(() => {
    findAllMyRecords();
  }, [searchTerm]);

  // Trigger the search when the component mounts
  useEffect(() => {
    findAllMyRecords();
  }, []);

  useEffect(() => {
    if (data) {
      setSearchResults(data as unknown as Record[]);
      setSearchTerm('');
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
        <Heading>My Records</Heading>
        <RecordSearchBar
          onSearch={handleSearch}
          onRecordAdded={handleRecordAdded}
          searchLoading={searchLoading}
        />
        <RecordList records={searchResults} />
      </VStack>
    </Box>
  );
};
