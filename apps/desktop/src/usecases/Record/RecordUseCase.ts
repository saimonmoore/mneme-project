import { FindRecordsByTagAction, AddRecordAction } from "@mneme/desktop/adapters/Record/RecordAdapter";

export const useFindRecordsByTag = (tagLabel: string) => {
    const { data, isLoading: loading, error, refetch } = FindRecordsByTagAction(tagLabel);

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