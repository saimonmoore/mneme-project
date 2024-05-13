import { useMutation, useQuery } from "@tanstack/react-query";
import { Record } from "@mneme/desktop/domain/Record/Record";

import { mockRecords } from "@mneme/desktop/__mocks__/records";

// Find records by tag
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

// Add record
const addRecord = async (record: Record) => {
    try {
        // Perform some async operation to login
        // Sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return new Promise((resolve, reject) => {
            // Reject 50% of the times
            if (Math.random() > 0.75) {
                reject(new Error("Unable to add Record. Please try again."));
            }
            resolve(record);
        });
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const AddRecordAction = () => {
    // Perform some async operation to login
    return useMutation({ mutationFn: async (record: Record) => addRecord(record) });
};