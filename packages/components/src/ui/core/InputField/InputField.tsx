import {
  Input as GluestackInput,
  InputField as GluestackInputField,
  InputSlot as GluestackInputSlot,
  InputIcon as GluestackInputIcon,
} from "@gluestack-ui/themed";
import { styled } from "@gluestack-style/react";

const MnemeStyledInput = styled(GluestackInput, {});

interface InputProps {
  size?: "md";
  children?: React.ReactNode;
}

export const Input = ({ children, ...rest }: InputProps) => (
  <MnemeStyledInput {...rest}>{children}</MnemeStyledInput>
);
export const InputField = styled(GluestackInputField, {});
export const InputSlot = styled(GluestackInputSlot, {});
export const MnemeInputIcon = styled(GluestackInputIcon, {});
