import {
  Toast as GluestackToast,
  ToastDescription as GluestackToastDescription,
  ToastTitle as GluestackToastTitle,
  useToast as GluestackUseToast,
} from "@gluestack-ui/themed";
import { styled } from "@gluestack-style/react";

export const Toast = styled(GluestackToast, {
  // bg: "$primary600",
  // pt: "$6",
});

export const ToastDescription = styled(GluestackToastDescription, {
  // bg: "$primary600",
  // pt: "$6",
});

export const ToastTitle = styled(GluestackToastTitle, {
  // bg: "$primary600",
  // pt: "$6",
});

export const useToast = GluestackUseToast;