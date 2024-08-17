import { Button, ButtonGroup, ButtonIcon, ButtonText, Box } from '@mneme/components';

export const BadgeWithAction = ({
  icon,
  label,
  size = 'xs',
  variant = 'solid',
  iconColor = '$textLight900',
  textColor = '$textLight900',
  borderColor = '$backgroundLight300',
  onPrimaryClick,
  onSecondaryClick,
}: {
  icon: React.ReactNode;
  label: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
  iconColor?: string;
  borderColor?: string;
  textColor?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}) => {
  return (
    <Box width="100%">
      <ButtonGroup isAttached width="100%">
        <Button
          flex={1}
          borderRadius="$md"
          variant={variant}
          size={size}
          borderColor={borderColor}
          borderRightWidth="$0"
          $dark-borderColor="$backgroundDark700"
          onPress={onPrimaryClick}
        >
          <ButtonText color={textColor} $dark-color="$textDark300">
            {label}
          </ButtonText>
        </Button>
        <Button
          variant={variant}
          size={size}
          borderColor={borderColor}
          $dark-borderColor="$backgroundDark70"
          onPress={onSecondaryClick}
          borderRadius="$md"
        >
          <ButtonIcon
            as={icon}
            color={iconColor}
            $dark-color="$textDark300"
          />
        </Button>
      </ButtonGroup>
    </Box>
  );
};