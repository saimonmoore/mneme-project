import { useMutation, useQuery } from '@tanstack/react-query';
import { Record } from '@mneme/desktop/domain/Record/Record';
import { Mneme } from '@mneme/core';
import { useMneme } from '@mneme/core-web';
import type { RecordUrl } from '@mneme/domain';
import { KeywordInputDto } from '@mneme/core/src/modules/Record/domain/dtos/KeywordInputDto';

// Find records by keyword
const findRecordsByKeyword = async (keywordLabel: string, mneme: Mneme) => {
  try {
    return await Array.fromAsync(mneme.myRecordsForKeyword(keywordLabel));
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export const FindRecordsByKeywordAction = (keywordLabel: string) => {
  const { mneme } = useMneme();

  return useQuery({
    queryKey: ['recordsByKeyword', keywordLabel],
    queryFn: async () => findRecordsByKeyword(keywordLabel, mneme!),
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
    });
  } catch (error: unknown) {
    console.error('Error adding record', error);
    throw new Error((error as Error).message);
  }
};

export const AddRecordAction = () => {
  const { mneme } = useMneme();

  return useMutation({
    mutationFn: async (record: Record) => addRecord(record, mneme!),
  });
};

// New function to update a record
const updateRecord = async (key: string, updatedKeywords: KeywordInputDto | KeywordInputDto[], mneme: Mneme) => {
  try {
    return await mneme.updatePrivateRecord(key, updatedKeywords);
  } catch (error: unknown) {
    console.error('Error updating record', error);
    throw new Error((error as Error).message);
  }
};

// New action for updating a record
export const UpdateRecordAction = () => {
  const { mneme } = useMneme();

  return useMutation({
    mutationFn: async ({ key, updatedKeywords }: { key: string; updatedKeywords: KeywordInputDto | KeywordInputDto[] }) => 
      updateRecord(key, updatedKeywords, mneme!),
  });
};