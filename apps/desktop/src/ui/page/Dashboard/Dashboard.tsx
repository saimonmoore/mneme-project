import { useState } from "react";
import {
  Badge,
  BadgeText,
  Box,
  Button,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Link,
  LinkText,
  SearchIcon,
  Text,
  HStack,
  VStack,
  HTMLBadge,
  TwitterBadge,
  PDFBadge,
  YoutubeBadge,
  Pressable,
  Heading,
} from "@mneme/components";

export type MnemeURL = {
  url: string;
  tags: string[];
  keywords: string[];
  type: URLType;
};

const URLIcons = {
  html: <HTMLBadge width="24" height="24" />,
  pdf: <PDFBadge width="24" height="24" />,
  twitter: <TwitterBadge width="24" height="24" />,
  youtube: <YoutubeBadge width="24" height="24" />,
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
    <HStack justifyContent="flex-start" gap="$4" mb="$6" ml="$6">
      <Box> {URLIcons[type]}</Box>
      <VStack alignItems="stretch" gap="$2">
        <Link href={url}>
          <LinkText>{url}</LinkText>
        </Link>
        <HStack justifyContent="flex-end" gap="$2">
          {tags?.map((tag) => (
            <Pressable>
              <Badge
                size="sm"
                action="info"
                borderRadius="$sm"
                variant="outline"
                key={tag}
              >
                <BadgeText>{tag}</BadgeText>
              </Badge>
            </Pressable>
          ))}
          {keywords?.map((keyword) => (
            <Pressable>
              <Badge
                size="sm"
                action="success"
                borderRadius="$sm"
                variant="outline"
                key={keyword}
              >
                <BadgeText>{keyword}</BadgeText>
              </Badge>
            </Pressable>
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
    tags: ["p2p"],
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
    tags: ["bird"],
    keywords: ["social", "media"],
  },
  {
    url: "https://www.pdf.com",
    type: URLType.PDF,
    tags: ["document"],
    keywords: ["adobe", "pdf"],
  },
];

export const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (term: string) => {
    setSearchResults([term]);
  };

  return (
    <Box w="$full" alignItems="center">
      <Heading>Dashboard</Heading>
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
