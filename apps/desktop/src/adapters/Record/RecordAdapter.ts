import { useQuery } from "@tanstack/react-query";

import { mockRecords } from "@mneme/desktop/__mocks__/records";

const findRecordsByTag = async (_tagLabel: string) => {
    try {
        // Perform some async operation to signup
        // Sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 500));

        return new Promise((resolve) => {
            resolve(mockRecords());
        });
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const FindRecordsByTagAction = (tagLabel: string) => {
    // Perform some async operation to find records by tag
    return useQuery({queryKey: ['recordsByTag', tagLabel], queryFn: async () => findRecordsByTag(tagLabel), enabled: false });
};