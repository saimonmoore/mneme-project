import { useEffect, useState } from 'react';

import {
  AddIcon,
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
} from '@mneme/components';

import {
  Notification,
  NotificationType,
} from '@mneme/desktop/ui/viewComponents/Notification/Notification';

import { Record } from '@mneme/desktop/domain/Record/Record';
import { type RecordUrl } from '@mneme/domain';
import { useRecords } from '@mneme/desktop/contexts/RecordsContext';

// import { useMnemeStore } from '@mneme/desktop/store';

export const RecordSearchBar = ({
  onRecordAdded,
  onSearch,
  searchLoading,
}: {
  onRecordAdded: (record: Record) => void;
  onSearch: (term: string) => void;
  searchLoading: boolean;
}) => {
  const toast = useToast();
  const {
    searchTerm,
    setSearchTerm,
    addRecordMutation,
    newRecord,
    addRecordLoading,
    addRecordError,
  } = useRecords();
  const [newUrl, setNewUrl] = useState<RecordUrl | undefined>(undefined);

  function handleInputSubmitted() {
    addRecord();
  }

  function addRecord() {
    if (!newUrl) return;

    const record = Record.create({
      url: newUrl,
    });

    console.log('Adding record...', { record });
    addRecordMutation!(record);
    setNewUrl(undefined);
    setSearchTerm!('');
  }

  function handleSearch(termOrUrl: string) {
    if (URL.canParse(termOrUrl)) {
      setNewUrl(termOrUrl as RecordUrl);
      setSearchTerm!('');
      return;
    }

    setNewUrl(undefined);
    setSearchTerm!(termOrUrl);

    if (termOrUrl?.length >= 2) {
      onSearch!(termOrUrl);
    }
  }

  useEffect(() => {
    if (newRecord) {
      onRecordAdded(newRecord);
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
    <HStack mb="$8" flexWrap="wrap" justifyContent="center">
      <Input flex={1} minWidth="$64" mb="$2">
        <InputField
          placeholder="Paste url or search term..."
          value={searchTerm || newUrl}
          onChangeText={(term: string) => handleSearch(term)}
          onSubmitEditing={handleInputSubmitted}
        />
        <InputSlot pr="$2">
          <Spinner loading={searchLoading}>
            <InputIcon>
              {!newUrl && <Icon as={SearchIcon} m="$2" w="$4" h="$4" />}
            </InputIcon>
          </Spinner>
        </InputSlot>
      </Input>
      {(newUrl || addRecordLoading) && (
        <Button variant="outline" onPress={() => addRecord()} mb="$2" ml="$2">
          <ButtonText mr="$2">Add</ButtonText>
          <Spinner loading={addRecordLoading}>
            <ButtonIcon as={AddIcon} />
          </Spinner>
        </Button>
      )}
    </HStack>
  );
};
