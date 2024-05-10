import { Box, ColourMode, Icon, MoonIcon, SunIcon } from "@mneme/components";
import { useMnemeUIStore } from "@mneme/components";
import { theme } from "@mneme/components";
import { Pressable } from "react-native";

const toggleColourMode = (mode: ColourMode) => {
  return mode === ColourMode.Light ? ColourMode.Dark : ColourMode.Light;
};

export const ThemeSwitcher = () => {
  const currentColourMode =
    useMnemeUIStore((state) => state.currentColourMode) ||
    theme.DEFAULT_COLOR_MODE;
  const setColourMode = useMnemeUIStore((state) => state.setColourMode);

  return (
    <Box>
      <Pressable
        onPress={() => setColourMode(toggleColourMode(currentColourMode))}
      >
        {currentColourMode === ColourMode.Light && (
          <Icon as={MoonIcon} m="$2" w="$4" h="$4" />
        )}
        {currentColourMode === ColourMode.Dark && (
          <Icon as={SunIcon} m="$2" w="$4" h="$4" />
        )}
      </Pressable>
    </Box>
  );
};
