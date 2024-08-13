import {
  Avatar as GluestackAvatar,
  AvatarGroup as GluestackAvatarGroup,
  AvatarFallbackText as GluestackAvatarFallbackText,
  AvatarBadge as GluestackAvatarBadge,
  AvatarImage as GluestackAvatarImage
} from "@gluestack-ui/themed";
import { styled } from "@gluestack-style/react";

const MnemeStyledAvatar = styled(GluestackAvatar);

interface AvatarProps {
  children?: React.ReactNode;
}

export const Avatar = ({ children, ...rest }: AvatarProps) => (
  <MnemeStyledAvatar {...rest}>{children}</MnemeStyledAvatar>
);

export const AvatarGroup = styled(GluestackAvatarGroup, {});
export const AvatarImage = styled(GluestackAvatarImage, {});
export const AvatarFallbackText = styled(GluestackAvatarFallbackText, {});
export const AvatarBadge = styled(GluestackAvatarBadge, {});