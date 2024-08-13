import { Record } from "@mneme/desktop/domain/Record/Record";

import {
  Avatar,
  AvatarImage,
  Badge,
  BadgeIcon,
  BadgeText,
  Box,
  EditIcon,
  Icon,
  Image,
  Link,
  LinkText,
  Text,
  HStack,
  VStack,
  HTMLBadge,
  TwitterBadge,
  PDFBadge,
  YoutubeBadge,
  Pressable,
} from "@mneme/components";

import { RecordType } from "@mneme/domain";

const iconForType = (type: RecordType) => {
  switch (type) {
    case RecordType.HTML:
      return <HTMLBadge width="24" height="24" />;
    case RecordType.PDF:
      return <PDFBadge width="24" height="24" />;
    case RecordType.TWITTER:
      return <TwitterBadge width="24" height="24" />;
    case RecordType.YOUTUBE:
      return <YoutubeBadge width="24" height="24" />;
    default:
      return <HTMLBadge width="24" height="24" />;
  }
}

const ImageWithIcon = ({ source, alt }: { source: string; alt: string }) => {
  return (
    <VStack>
      <Avatar>
      <AvatarImage source={source} alt={alt} />
      </Avatar>
      <Icon as={EditIcon} />
    </VStack>
  );
}

const Logo = ({ src, type, publisher }: { src: string; type: RecordType, publisher: string }) => {
  return (
    <Box>
      {src && <ImageWithIcon source={src} alt={publisher || type} />}
      {!src && iconForType(type)}
    </Box>
  );
}

export const RecordCard = ({ record }: { record: Record }) => {
  const { description, logo, url, title, keywords, type, publisher } = record;

  return (
    <HStack justifyContent="flex-start" gap="$4" mb="$6" ml="$6">
      <Box><Logo src={logo} type={type} publisher={publisher} /></Box>
      <VStack alignItems="stretch" gap="$2">
        <Link href={url} isExternal>
          <LinkText>{title || url} ({publisher})</LinkText>
        </Link>
        <Box>{description && <Text italic isTruncated size="sm">{description}</Text>}</Box>
        <HStack justifyContent="flex-end" gap="$2">
          {Array.from(keywords || []).map((keyword) => (
            <Pressable key={keyword.label}>
              <Badge
                size="sm"
                action="success"
                borderRadius="$sm"
                variant="outline"
                key={keyword.label}
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
