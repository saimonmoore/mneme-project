import { useEffect, useState } from 'react';

import {
  AddIcon,
  Box,
  Button,
  ButtonText,
  ButtonIcon,
  HStack,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Spinner,
  useToast,
  VStack,
  useBreakpointValue,
} from '@mneme/components';

import { RecordCard } from '@mneme/desktop/ui/viewComponents/Record/RecordCard';
import {
  Notification,
  NotificationType,
} from '@mneme/desktop/ui/viewComponents/Notification/Notification';

import { Record } from '@mneme/desktop/domain/Record/Record';
import {
  useFindMyRecords,
  useAddRecord,
} from '@mneme/desktop/usecases/Record/RecordUseCase';
import { type RecordUrl } from '@mneme/domain';

// import { useMnemeStore } from '@mneme/desktop/store';

export const RecordList = () => {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState<RecordUrl | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<Record[]>([]);

  // const records = useMnemeStore((state) => state.records);
  // const addRecordToStore = useMnemeStore((state) => state.addRecord);

  const {
    executeQuery: findAllMyRecords,
    data,
    loading,
    error,
  } = useFindMyRecords();

  const {
    addRecord: addRecordMutation,
    data: newRecord,
    loading: addRecordLoading,
    error: addRecordError,
  } = useAddRecord();

  const containerWidth = useBreakpointValue({
    base: '$full',
    sm: '$full',
    md: '$3/4',
    lg: '$2/3',
    xl: '$1/2',
  });

  function handleKeyPress() {
    addRecord();
  }

  function addRecord() {
    if (!newUrl) return;

    const record = Record.create({
      url: newUrl,
    });

    console.log('Adding record...', { record });
    addRecordMutation(record);
    setNewUrl(undefined);
    setSearch('');
  }

  function handleSearch(termOrUrl: string) {
    if (URL.canParse(termOrUrl)) {
      setNewUrl(termOrUrl as RecordUrl);
    } else {
      setNewUrl(undefined);
    }

    setSearch(termOrUrl);
  }

  useEffect(() => {
    findAllMyRecords();
  }, []);

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

      console.error('Error listing records: ', addRecordError);
    }
  }, [data, error]);

  useEffect(() => {
    if (newRecord) {
      findAllMyRecords();
    }

    if (addRecordError) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="No records found"
            description={`There was an error persisting your record! (${addRecordError.message})`}
          />
        ),
      });

      console.error('Error adding record: ', addRecordError);
    }
  }, [newRecord, addRecordError]);

  return (
    <Box w="$full" alignItems="center">
      <VStack w={containerWidth} space="md" px="$4">
        <HStack mb="$8" flexWrap="wrap" justifyContent="center">
          <Button variant="outline" onPress={() => findAllMyRecords()} mb="$2">
            <ButtonText mr="$2">Refresh</ButtonText>
            <Spinner loading={loading}>
              <ButtonIcon as={SearchIcon} />
            </Spinner>
          </Button>
          <Input flex={1} minWidth="$64" mb="$2">
            <InputField
              placeholder="Paste url or search term..."
              value={search}
              onChangeText={(term: string) => handleSearch(term)}
              onSubmitEditing={handleKeyPress}
            />
            <InputSlot pr="$2">
              <Spinner loading={loading}>
                <InputIcon>
                  {!newUrl && <Icon as={SearchIcon} m="$2" w="$4" h="$4" />}
                </InputIcon>
              </Spinner>
            </InputSlot>
          </Input>
          {(newUrl || addRecordLoading) && (
            <Button variant="outline" onPress={() => addRecord()} mb="$2">
              <ButtonText mr="$2">Add</ButtonText>
              <Spinner loading={addRecordLoading}>
                <ButtonIcon as={AddIcon} />
              </Spinner>
            </Button>
          )}
        </HStack>
        <VStack w="$full" space="md">
          {searchResults.map((record: Record, index: number) => (
            <RecordCard record={record} key={index} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};
