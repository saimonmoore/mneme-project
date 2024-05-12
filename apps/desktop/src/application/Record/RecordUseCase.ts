import { FindRecordsByTagAction } from "@mneme/desktop/adapters/Record/RecordAdapter";

export const useFindRecordsByTag = (tagLabel: string) => {
    const { data, isLoading: loading, error, refetch } = FindRecordsByTagAction(tagLabel);

    return {
        executeQuery: refetch,
        data,
        loading,
        error,
    };
};