import { Toast, ToastDescription, ToastTitle, VStack } from "@mneme/components";

export enum NotificationType {
  ATTENTION = "attention",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

export type NotificationProps = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
};

export const Notification = ({
  id,
  type,
  title,
  description,
}: NotificationProps) => (
  <Toast nativeID={`toast-${id}`} action={type} variant="solid">
    <VStack space="xs">
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription>{description}</ToastDescription>
    </VStack>
  </Toast>
);
