import {
  FindRecordsByKeywordAction,
  FindMyRecordsAction,
  AddRecordAction,
  UpdateRecordAction,
} from '@mneme/desktop/adapters/Record/RecordAdapter';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';

export const useFindRecordsByKeyword = (keyword: Keyword) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = FindRecordsByKeywordAction(keyword);

  return {
    executeQuery: refetch,
    data,
    loading,
    error,
  };
};

export const useFindMyRecords = () => {
  const { data, isLoading: loading, error, refetch } = FindMyRecordsAction();
  console.log('[useFindMyRecords] ===============> ', { data, loading, error });

  return {
    executeQuery: refetch,
    data,
    loading,
    error,
  };
};

export const useAddRecord = () => {
  const action = AddRecordAction();

  const { data, isPending: loading, error } = action;

  console.log('[useAddRecord] ===============> ', { data, loading, error });

  return {
    addRecord: action.mutate,

    data,
    loading,
    error,
  };
};

export const useUpdateRecord = () => {
  const action = UpdateRecordAction();

  const { data, isPending: loading, error } = action;

  console.log('[useUpdateRecord] ===============> ', { data, loading, error });

  return {
    updateRecord: action.mutate,

    data,
    loading,
    error,
  };
};
