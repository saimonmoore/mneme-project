import { useMutation, useQuery } from '@tanstack/react-query';
import { Record } from '@mneme/desktop/domain/Record/Record';
import { Mneme } from '@mneme/core';
import { useMneme } from '@mneme/core-web';

// import { mockRecords } from "@mneme/desktop/__mocks__/records";

// Find records by tag
const findRecordsByTag = async (tagLabel: string, mneme: Mneme) => {
  try {
    return await Array.fromAsync(mneme.myRecordsForTag(tagLabel));
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export const FindRecordsByTagAction = (tagLabel: string) => {
  const { mneme } = useMneme();

  return useQuery({
    queryKey: ['recordsByTag', tagLabel],
    queryFn: async () => findRecordsByTag(tagLabel, mneme!),
    enabled: false,
  });
};

// list all my records
const findMyRecords = async (mneme: Mneme) => {
  try {
    return await Array.fromAsync(mneme.myRecords());
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export const FindMyRecordsAction = () => {
  const { mneme } = useMneme();

  return useQuery({
    queryKey: ['myRecords'],
    queryFn: async () => findMyRecords(mneme!),
    enabled: false,
  });
};

const addRecord = async (record: Record, mneme: Mneme) => {
  try {
    return await mneme.addPrivateRecord({
      url: record.url,
      type: record.type,
      tags: Array.from(record.tags),
      keywords: Array.from(record.keywords),
      language: record.language,
      creatorId: record.creatorHash,
    });
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export const AddRecordAction = () => {
  const { mneme } = useMneme();

  return useMutation({
    mutationFn: async (record: Record) => addRecord(record, mneme!),
  });
};
