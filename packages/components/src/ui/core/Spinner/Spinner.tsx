import { Spinner as GluestackSpinner } from "@gluestack-ui/themed";
import { styled } from "@gluestack-style/react";

const StyledSpinner = styled(GluestackSpinner, {
  // bg: "$primary600",
  // pt: "$6",
});

export interface SpinnerProps {
  loading: boolean;
  size?: "small" | "large";
  children: React.ReactNode;
}

export const Spinner = ({loading, size = "small", children} : SpinnerProps ) => {
  return loading ? <StyledSpinner size={size}/> : children;
};
