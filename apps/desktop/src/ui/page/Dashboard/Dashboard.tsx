import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Icon,
  Image,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Text,
  VStack,
  HTMLBadge,
  TwitterBadge,
  PDFBadge,
  YoutubeBadge,
} from "@mneme/components";
import { HStack } from "@gluestack-ui/themed";

export type MnemeURL = {
  url: string;
  tags: string[];
  keywords: string[];
  type: URLType;
};

const URLIcons = {
  html: HTMLBadge,
  pdf: PDFBadge,
  twitter: TwitterBadge,
  youtube: YoutubeBadge,
};

enum URLType {
  HTML = "html",
  PDF = "pdf",
  TWITTER = "twitter",
  YOUTUBE = "youtube",
}

const URLCard = ({ urlRecord }: { urlRecord: MnemeURL }) => {
  const { url, tags, keywords, type } = urlRecord;

  return (
    <HStack>
      <VStack>
        <Image size="xs" source={URLIcons[type]} />
        <Text>{url}</Text>
        <HStack>
          {tags?.map((tag) => (
            <Badge size="sm" action="info" borderRadius="$sm" key={tag}>
              {tag}
            </Badge>
          ))}
          {keywords?.map((keyword) => (
            <Badge size="sm" action="success" borderRadius="$sm" key={keyword}>
              {keyword}
            </Badge>
          ))}
        </HStack>
      </VStack>
    </HStack>
  );
};

const mockURLs = [
  {
    url: "https://www.google.com",
    type: URLType.HTML,
    tags: ["search"],
    keywords: ["search", "engine"],
  },
  {
    url: "https://www.youtube.com",
    type: URLType.YOUTUBE,
    tags: ["video"],
    keywords: ["video", "streaming"],
  },
  {
    url: "https://www.twitter.com",
    type: URLType.TWITTER,
    tags: ["social"],
    keywords: ["social", "media"],
  },
  {
    url: "https://www.pdf.com",
    type: URLType.PDF,
    tags: ["document"],
    keywords: ["document", "pdf"],
  },
];

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
        {mockURLs.map((url: MnemeURL) => (
          <URLCard urlRecord={url} />
        ))}
      </VStack>
    </Box>
  );
};
