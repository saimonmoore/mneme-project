import { useState } from 'react';
import { Record } from '@mneme/desktop/domain/Record/Record';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';
import { useUpdateRecord } from '@mneme/desktop/usecases/Record/RecordUseCase';
import { KeywordInputDto } from '@mneme/core/src/modules/Record/domain/dtos/KeywordInputDto';
import { useToast } from '@mneme/components';
import { Notification, NotificationType } from '@mneme/desktop/ui/viewComponents/Notification/Notification';

import {
  Avatar,
  AvatarImage,
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
  Tooltip,
  TooltipContent,
  TooltipText,
} from '@mneme/components';

import { RecordType } from '@mneme/domain';
import { EditKeywordModal } from './EditKeywordModal';
import { KeywordList } from './KeywordList';

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
  const [updatedKeywords, setUpdatedKeywords] = useState<KeywordInputDto[]>(
    Array.from(keywords) || [],
  );

  const { updateRecord, isUpdating } = useUpdateRecord();
  const toast = useToast();

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

  const handleSaveKeyword = async () => {
    const newKeywords = [...updatedKeywords];
    newKeywords[editingKeywordIndex] = {
      label: selectedKeyword,
    };
    setUpdatedKeywords(newKeywords);

    try {
      await updateRecord(record.id, newKeywords);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating record:', error);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="Error updating record"
            description={`There was an error updating your record! (${(error as Error).message})`}
          />
        ),
      });
    }
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
            <Tooltip
              placement="top"
              trigger={(triggerProps) => (
                <Link href={url} isExternal maxWidth={cardWidth} {...triggerProps}>
                  <LinkText isTruncated>
                    {title || url} ({publisher})
                  </LinkText>
                </Link>
              )}
            >
              <TooltipContent>
                <TooltipText>
                  {`${title || url}\n${description || ''}`}
                </TooltipText>
              </TooltipContent>
            </Tooltip>
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
          <KeywordList
            keywords={updatedKeywords as Keyword[]}
            isEditing={isEditing}
            onKeywordClick={handleBadgeClick}
          />
        </VStack>
      </HStack>

      <EditKeywordModal
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedKeyword={selectedKeyword}
        setSelectedKeyword={setSelectedKeyword}
        onSave={handleSaveKeyword}
        isUpdating={isUpdating}
      />
    </>
  );
};