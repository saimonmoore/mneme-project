import {
  AlertDialog as GluestackAlertDialog,
  AlertDialogBackdrop as GluestackAlertDialogBackdrop,
  AlertDialogHeader as GluestackAlertDialogHeader,
  AlertDialogFooter as GluestackAlertDialogFooter,
  AlertDialogBody as GluestackAlertDialogBody,
  AlertDialogContent as GluestackAlertDialogContent,
  AlertDialogCloseButton as GluestackAlertDialogCloseButton
} from "@gluestack-ui/themed";
import { styled } from "@gluestack-style/react";

const MnemeStyledAlertDialog = styled(GluestackAlertDialog);

interface AlertDialogProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  avoidKeyboard?: boolean;
}

export const AlertDialog = ({ children, ...rest }: AlertDialogProps) => (
  <MnemeStyledAlertDialog {...rest}>{children}</MnemeStyledAlertDialog>
);

export const AlertDialogBackdrop = styled(GluestackAlertDialogBackdrop, {});
export const AlertDialogContent = styled(GluestackAlertDialogContent, {});
export const AlertDialogCloseButton = styled(GluestackAlertDialogCloseButton, {});
export const AlertDialogHeader = styled(GluestackAlertDialogHeader, {});
export const AlertDialogFooter = styled(GluestackAlertDialogFooter, {});
export const AlertDialogBody = styled(GluestackAlertDialogBody, {});