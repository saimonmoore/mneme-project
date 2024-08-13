import { Record } from '@mneme/desktop/domain/Record/Record';

import {
  Avatar,
  AvatarImage,
  Badge,
  BadgeText,
  Box,
  EditIcon,
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
  useBreakpointValue,
} from '@mneme/components';

import { RecordType } from '@mneme/domain';

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
};

const ImageWithIcon = ({ source, alt }: { source: string; alt: string }) => {
  return (
    <VStack>
      <Avatar>
        <AvatarImage source={source} alt={alt} />
      </Avatar>
    </VStack>
  );
};

const Logo = ({
  src,
  type,
  publisher,
}: {
  src: string;
  type: RecordType;
  publisher: string;
}) => {
  return (
    <Box>
      {src && <ImageWithIcon source={src} alt={publisher || type} />}
      {!src && iconForType(type)}
    </Box>
  );
};

export const RecordCard = ({ record }: { record: Record }) => {
  const { description, logo, url, title, keywords, type, publisher } = record;

  const cardWidth = useBreakpointValue({
    base: '100%',
    sm: '100%',
    md: '90%',
    lg: '90%',
    xl: '90%',
  });

  return (
    <HStack
      justifyContent="flex-start"
      gap="$4"
      mb="$6"
      ml="$6"
      bg="$teal100"
      borderRadius="$xl"
      p="$4"
      width={cardWidth}
      minWidth={cardWidth}
    >
      <Box>
        <Logo src={logo} type={type} publisher={publisher} />
      </Box>
      <VStack alignItems="stretch" gap="$2" flex={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <Link href={url} isExternal>
            <LinkText>
              {title || url} ({publisher})
            </LinkText>
          </Link>
          <Pressable>
            <EditIcon size="sm" />
          </Pressable>
        </HStack>
        <Box>
          {description && (
            <Text italic isTruncated size="sm">
              {description}
            </Text>
          )}
        </Box>
        <HStack justifyContent="flex-end" gap="$2">
          {Array.from(keywords || []).map((keyword) => (
            <Pressable key={keyword.label}>
              <Badge
                size="sm"
                action="success"
                borderRadius="$full"
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
