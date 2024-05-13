import { useEffect, useState } from "react";

import {
  AddIcon,
  Box,
  Button,
  ButtonText,
  ButtonIcon,
  Heading,
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
} from "@mneme/components";

import { RecordCard } from "@mneme/desktop/ui/viewComponents/Record/RecordCard";
import {
  Notification,
  NotificationType,
} from "@mneme/desktop/ui/viewComponents/Notification/Notification";

import { Record } from "@mneme/desktop/domain/Record/Record";
import {
  useFindRecordsByTag,
  useAddRecord,
} from "@mneme/desktop/usecases/Record/RecordUseCase";
import { mockRecords } from "@mneme/desktop/__mocks__/records";
import { RecordLanguage, RecordType, type RecordUrl } from "@mneme/domain";

import { useMnemeStore } from "@mneme/desktop/store";

export const Dashboard = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [newUrl, setNewUrl] = useState<RecordUrl | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<Record[]>([]);

  const records = useMnemeStore((state) => state.records);
  const addRecordToStore = useMnemeStore((state) => state.addRecord);

  const { executeQuery, data, loading, error } = useFindRecordsByTag(search);

  const {
    addRecord: addRecordMutation,
    data: newRecord,
    loading: addRecordLoading,
    error: addRecordError,
  } = useAddRecord();

  function handleKeyPress() {
    addRecord();
  }

  function addRecord() {
    if (!newUrl) return;

    const record = Record.create({
      url: newUrl,
      language: RecordLanguage.ENGLISH,
      type: RecordType.HTML,
      tags: [{ label: "tag" }],
      keywords: [{ label: "keyword" }],
    });

    console.log("Adding record...", { record });
    addRecordMutation(record);
    setNewUrl(undefined);
    setSearch("");
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
    if (!newUrl && search && search.length > 2 && !loading) {
      executeQuery();
    }
  }, [search]);

  useEffect(() => {
    if (data) {
      setSearchResults(data as Record[]);
    }

    if (error) {
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="No records found"
            description={`There was an error looking for your records! (${error.message})`}
          />
        ),
      });
    }
  }, [data, error]);

  useEffect(() => {
    if (newRecord) {
      addRecordToStore(newRecord as Record);
    }

    if (addRecordError) {
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="No records found"
            description={`There was an error persisting your record! (${addRecordError.message})`}
          />
        ),
      });
    }
  }, [newRecord, addRecordError]);

  return (
    <Box w="$full" alignItems="center">
      <Heading mb="$8">Dashboard</Heading>
      <HStack w="$80" mb="$8">
        <Input mr="$4" w="$80">
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
          <Button variant="outline" onPress={() => addRecord()}>
            <ButtonText mr="$2">Add</ButtonText>
            <Spinner loading={addRecordLoading}>
              <ButtonIcon as={AddIcon} />
            </Spinner>
          </Button>
        )}
      </HStack>
      <VStack>
        {searchResults.map((record: Record) => (
          <RecordCard record={record} key={record.url} />
        ))}
      </VStack>
      <VStack>
        <Heading mb="$8" italic size="md">
          Latest Bookmarks
        </Heading>
        {(records ?? []).map((record: Record) => (
          <RecordCard record={record} key={record.url} />
        ))}
      </VStack>
    </Box>
  );
};
