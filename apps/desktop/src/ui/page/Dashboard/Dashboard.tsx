import { useEffect, useState } from "react";
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
} from "@mneme/components";

export const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  const handleSearch = (term: string) => {
    setSearchResults([term]);
  };

  useEffect(() => {
    // fetch activity feed
    setActivityFeed(["Activity 1", "Activity 2", "Activity 3"]);
  });

  return (
    <Box>
      <Text>Dashboard</Text>
      <Box>
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
        <Button variant="link" onPress={() => handleSearch(search)}><Text>Search</Text></Button>
      </Box>
      <VStack>
        {searchResults.map((result) => (
          <Text key={result}>{result}</Text>
        ))}
      </VStack>
      <VStack>
        {activityFeed.map((activity) => (
          <Text key={activity}>{activity}</Text>
        ))}
      </VStack>
    </Box>
  );
};
