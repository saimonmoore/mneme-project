import {
  FindKeywordByLabelAction,
} from '@mneme/desktop/adapters/Keyword/KeywordAdapter';

export const useFindKeywordByLabel = (keywordLabel: string) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = FindKeywordByLabelAction(keywordLabel);

  return {
    executeQuery: refetch,
    data,
    loading,
    error,
  };
};