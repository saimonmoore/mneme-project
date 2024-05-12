import { useEffect, useState } from "react";

import { Record } from "@mneme/desktop/domain/Record/Record";
import {
  Box,
  Button,
  ButtonText,
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

import { mockRecords } from "@mneme/desktop/__mocks__/records";
import { RecordCard } from "@mneme/desktop/ui/viewComponents/Record/RecordCard";
import {
  Notification,
  NotificationType,
} from "@mneme/desktop/ui/viewComponents/Notification/Notification";
import { useFindRecordsByTag } from "@mneme/desktop/application/Record/RecordUseCase";

export const Dashboard = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Record[]>([]);

  const { executeQuery, data, loading, error } = useFindRecordsByTag(search);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  useEffect(() => {
    if (search && search.length > 2 && !loading) {
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

  return (
    <Box w="$full" alignItems="center">
      <Heading mb="$8">Dashboard</Heading>
      <HStack w="$80" mb="$8">
        <Input mr="$4" w="$80">
          <InputField
            placeholder="Search ..."
            value={search}
            onChangeText={(term: string) => setSearch(term)}
          />
          <InputSlot pr="$2">
            <Spinner loading={loading}>
              <InputIcon>
                <Icon as={SearchIcon} m="$2" w="$4" h="$4" />
              </InputIcon>
            </Spinner>
          </InputSlot>
        </Input>
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
        {mockRecords().map((record: Record) => (
          <RecordCard record={record} key={record.url} />
        ))}
      </VStack>
    </Box>
  );
};
