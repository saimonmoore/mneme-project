import { FindRecordsByKeywordAction, FindMyRecordsAction, AddRecordAction } from "@mneme/desktop/adapters/Record/RecordAdapter";

export const useFindRecordsByKeyword = (keywordLabel: string) => {
    const { data, isLoading: loading, error, refetch } = FindRecordsByKeywordAction(keywordLabel);

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