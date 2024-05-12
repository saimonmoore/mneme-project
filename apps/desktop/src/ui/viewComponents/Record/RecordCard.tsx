import { Record } from "@mneme/desktop/domain/Record/Record";

import {
  Badge,
  BadgeText,
  Box,
  Link,
  LinkText,
  HStack,
  VStack,
  HTMLBadge,
  TwitterBadge,
  PDFBadge,
  YoutubeBadge,
  Pressable,
} from "@mneme/components";

const URLIcons = {
  html: <HTMLBadge width="24" height="24" />,
  pdf: <PDFBadge width="24" height="24" />,
  twitter: <TwitterBadge width="24" height="24" />,
  youtube: <YoutubeBadge width="24" height="24" />,
};

export const RecordCard = ({ record }: { record: Record }) => {
  const { url, tags, keywords, type } = record;

  return (
    <HStack justifyContent="flex-start" gap="$4" mb="$6" ml="$6">
      <Box>{URLIcons[type]}</Box>
      <VStack alignItems="stretch" gap="$2">
        <Link href={url}>
          <LinkText>{url}</LinkText>
        </Link>
        <HStack justifyContent="flex-end" gap="$2">
          {Array.from(tags || []).map((tag) => (
            <Pressable key={tag.label}>
              <Badge
                size="sm"
                action="info"
                borderRadius="$sm"
                variant="outline"
                key={tag}
              >
                <BadgeText>{tag.label}</BadgeText>
              </Badge>
            </Pressable>
          ))}
          {Array.from(keywords || []).map((keyword) => (
            <Pressable key={keyword.label}>
              <Badge
                size="sm"
                action="success"
                borderRadius="$sm"
                variant="outline"
                key={keyword}
              >
                <BadgeText>{keyword.label}</BadgeText>
              </Badge>
            </Pressable>
          ))}
        </HStack>
      </VStack>
    </HStack>
  );
};
