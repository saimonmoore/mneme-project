import { Badge, BadgeText, BadgeWithAction, CloseIcon, Pressable, Box } from '@mneme/components';

interface KeywordBadgeProps {
  label: string;
  isEditing: boolean;
  onPressView?: () => void;
  onPressEdit?: () => void;
  onPressDelete?: () => void;
}

type KeywordBadgeWithActionProps = {
  label: string;
  onPressEdit?: () => void;
  onPressDelete?: () => void;
}

const KeywordBadgeWithAction = ({ label, onPressEdit, onPressDelete }: KeywordBadgeWithActionProps) => {
  return (
    <BadgeWithAction
      onPrimaryClick={onPressEdit}
      onSecondaryClick={onPressDelete}
      icon={CloseIcon}
      label={label}
      variant="outline"
   />
  );
};

export function KeywordBadge({ label, isEditing, onPressView, onPressDelete, onPressEdit }: KeywordBadgeProps) {
  if (isEditing) {
    return (
      <Box width="100%">
        <KeywordBadgeWithAction label={label} onPressEdit={onPressEdit} onPressDelete={onPressDelete} />
      </Box>
    );
  }

  return (
    <Pressable onPress={onPressView}>
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