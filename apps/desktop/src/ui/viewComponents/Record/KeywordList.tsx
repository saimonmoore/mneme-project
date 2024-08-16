import { HStack, Pressable, AddIcon } from '@mneme/components';
import { KeywordBadge } from './KeywordBadge';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';

interface KeywordListProps {
  keywords: Keyword[];
  isEditing: boolean;
  onKeywordClick: (keyword: Keyword, index: number) => void;
  onAddKeyword: () => void;
}

export function KeywordList({ keywords, isEditing, onKeywordClick, onAddKeyword }: KeywordListProps) {
  return (
    <HStack justifyContent="flex-end" gap="$2" alignItems="center">
      {keywords.map((keyword, index) => (
        <KeywordBadge
          key={index}
          label={keyword.label}
          isEditing={isEditing}
          onPress={() => onKeywordClick(keyword, index)}
        />
      ))}
      {isEditing && (
        <Pressable onPress={onAddKeyword}>
          <AddIcon size="sm" />
        </Pressable>
      )}
    </HStack>
  );
}