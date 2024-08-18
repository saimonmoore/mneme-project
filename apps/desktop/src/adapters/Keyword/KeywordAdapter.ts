import { useQuery } from '@tanstack/react-query';
import { Mneme } from '@mneme/core';
import { useMneme } from '@mneme/core-web';

// Find keyword by label
const findKeywordByLabel = async (keywordLabel: string, mneme: Mneme) => {
  try {
    return await mneme.findKeywordByLabel(keywordLabel);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export const FindKeywordByLabelAction = (keywordLabel: string) => {
  const { mneme } = useMneme();

  return useQuery({
    queryKey: ['keywordByLabel', keywordLabel],
    queryFn: async () => findKeywordByLabel(keywordLabel, mneme!),
    enabled: false,
  });
};