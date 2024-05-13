import React from "react";
import { Icon, Pressable } from "@mneme/components";

export type IconButtonProps = {
  icon: React.ReactElement;
  onPress?: () => void;
};

export const IconButton = ({ icon, onPress }: IconButtonProps) => (
  <Pressable onPress={onPress}>
    <Icon as={icon} size="md" />
  </Pressable>
);
