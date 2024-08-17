import {
  Button,
  ButtonIcon,
  HStack,
  AddIcon,
  VStack,
  Box,
} from '@mneme/components';
import { KeywordBadge } from './KeywordBadge';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';

interface KeywordListProps {
  keywords: Keyword[];
  isEditing: boolean;
  onKeywordClick: (keyword: Keyword, index: number) => void;
  onAddKeyword: () => void;
  onDeleteKeyword: (keyword: Keyword, index: number) => void;
}

const EditingKeywordList = ({
  keywords,
  onKeywordClick,
  onAddKeyword,
  onDeleteKeyword,
}: Omit<KeywordListProps, 'isEditing'>) => (
  <Box>
    <VStack>
      <Box flexDirection="row" flexWrap="wrap" gap="$2">
      {keywords.map((keyword, index) => (
        <Box key={index} width="$32" marginBottom="$2">
          <KeywordBadge
            label={keyword.label}
            isEditing
            onPressEdit={() => onKeywordClick(keyword, index)}
            onPressDelete={() => onDeleteKeyword(keyword, index)}
          />
          </Box>
        ))}
      </Box>
    </VStack>
    <Box alignSelf="flex-end">
      <Button
        borderRadius="$full"
        size="xs"
        p="$2"
        variant="outline"
        onPress={onAddKeyword}
      >
        <ButtonIcon margin="$0" as={AddIcon} />
      </Button>
    </Box>
  </Box>
);

const ViewingKeywordList = ({
  keywords,
}: Pick<KeywordListProps, 'keywords'>) => (
  <HStack justifyContent="flex-end" gap="$2" alignItems="center">
    {keywords.map((keyword, index) => (
      <KeywordBadge
        key={index}
        label={keyword.label}
        isEditing={false}
        onPressView={() => console.log('view', { keyword, index })}
      />
    ))}
  </HStack>
);

export function KeywordList({
  keywords,
  isEditing,
  onKeywordClick,
  onAddKeyword,
  onDeleteKeyword,
}: KeywordListProps) {
  if (isEditing) {
    return (
      <EditingKeywordList
        keywords={keywords}
        onKeywordClick={onKeywordClick}
        onAddKeyword={onAddKeyword}
        onDeleteKeyword={onDeleteKeyword}
      />
    );
  }

  return <ViewingKeywordList keywords={keywords} />;
}
