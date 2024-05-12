import { useState } from "react";

import { Record } from "@mneme/desktop/domain/Record/Record";
import {
  Box,
  Button,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Text,
  VStack,
  Heading,
} from "@mneme/components";

import { mockRecords } from "@mneme/desktop/__mocks__/records";
import { RecordCard } from "@mneme/desktop/ui/viewComponents/Record/RecordCard";

export const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (term: string) => {
    setSearchResults([term]);
  };

  return (
    <Box w="$full" alignItems="center">
      <Heading>Dashboard</Heading>
      <Box w="$80">
        <Input>
          <InputField
            placeholder="Search ..."
            value={search}
            onChangeText={(term: string) => setSearch(term)}
          />
          <InputSlot>
            <InputIcon>
              <Icon as={SearchIcon} m="$2" w="$4" h="$4" />
            </InputIcon>
          </InputSlot>
        </Input>
        <Button variant="link" onPress={() => handleSearch(search)}>
          <Text>Search</Text>
        </Button>
      </Box>
      <VStack>
        {searchResults.map((result) => (
          <Text key={result}>{result}</Text>
        ))}
      </VStack>
      <VStack>
        <Heading mb="$8" italic="true" size="md">
          Latest Bookmarks
        </Heading>
        {mockRecords().map((record: Record) => (
          <RecordCard record={record} />
        ))}
      </VStack>
    </Box>
  );
};
