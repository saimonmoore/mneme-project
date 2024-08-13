import {
  Modal as GluestackModal,
  ModalBackdrop as GluestackModalBackdrop,
  ModalHeader as GluestackModalHeader,
  ModalFooter as GluestackModalFooter,
  ModalBody as GluestackModalBody,
  ModalContent as GluestackModalContent,
  ModalCloseButton as GluestackModalCloseButton
} from "@gluestack-ui/themed";
import { styled } from "@gluestack-style/react";

export const Modal = styled(GluestackModal);
export const ModalBackdrop = styled(GluestackModalBackdrop, {});
export const ModalContent = styled(GluestackModalContent, {});
export const ModalCloseButton = styled(GluestackModalCloseButton, {});
export const ModalHeader = styled(GluestackModalHeader, {});
export const ModalFooter = styled(GluestackModalFooter, {});
export const ModalBody = styled(GluestackModalBody, {});