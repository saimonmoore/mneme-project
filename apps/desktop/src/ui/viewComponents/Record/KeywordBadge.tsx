import { Badge, BadgeText, Pressable } from '@mneme/components';

interface KeywordBadgeProps {
  label: string;
  isEditing: boolean;
  onPress: () => void;
}

export function KeywordBadge({ label, isEditing, onPress }: KeywordBadgeProps) {
  return (
    <Pressable onPress={onPress}>
      <Badge
        size="sm"
        action="success"
        borderRadius="$full"
        variant={isEditing ? 'outline' : 'solid'}
      >
        <BadgeText>{label}</BadgeText>
      </Badge>
    </Pressable>
  );
}
