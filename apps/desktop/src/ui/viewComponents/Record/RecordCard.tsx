import { Record } from '@mneme/desktop/domain/Record/Record';

import {
  Avatar,
  AvatarImage,
  Badge,
  BadgeText,
  Box,
  EditIcon,
  CheckIcon,
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
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  InputField,
} from '@mneme/components';

import { RecordType, type Keyword } from '@mneme/domain';
import { useState } from 'react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [editingKeywordIndex, setEditingKeywordIndex] = useState(-1);
  const [updatedKeywords, setUpdatedKeywords] = useState(Array.from(keywords) || []);

  const cardWidth = useBreakpointValue({
    base: '100%',
    sm: '100%',
    md: '90%',
    lg: '90%',
    xl: '90%',
  });

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleBadgeClick = (keyword: string, index: number) => {
    if (isEditing) {
      setSelectedKeyword(keyword);
      setEditingKeywordIndex(index);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedKeyword('');
    setEditingKeywordIndex(-1);
    toggleEdit();
  };

  const handleSaveKeyword = () => {
    const newKeywords = [...updatedKeywords];
    newKeywords[editingKeywordIndex] = { label: selectedKeyword } as unknown as Keyword;
    setUpdatedKeywords(newKeywords);
    handleCloseModal();
  };

  return (
    <>
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
            <Pressable onPress={toggleEdit}>
              {isEditing ? <CheckIcon size="sm" /> : <EditIcon size="sm" />}
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
            {updatedKeywords.map((keyword, index) => (
              <Pressable
                key={index}
                onPress={() => handleBadgeClick(keyword.label, index)}
              >
                <Badge
                  size="sm"
                  action="success"
                  borderRadius="$full"
                  variant={isEditing ? 'outline' : 'solid'}
                >
                  <BadgeText>{keyword.label}</BadgeText>
                </Badge>
              </Pressable>
            ))}
          </HStack>
        </VStack>
      </HStack>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text>Edit Keyword</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input>
              <InputField
                value={selectedKeyword}
                onChangeText={setSelectedKeyword}
                placeholder="Enter keyword"
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              mr="$3"
              onPress={handleCloseModal}
            >
              <Text>Cancel</Text>
            </Button>
            <Button action="primary" onPress={handleSaveKeyword}>
              <Text>OK</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
