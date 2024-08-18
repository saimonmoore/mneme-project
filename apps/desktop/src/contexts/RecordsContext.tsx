import { createContext, useContext, useState } from 'react';
import { Record } from '@mneme/desktop/domain/Record/Record';
import { useAddRecord } from '@mneme/desktop/usecases/Record/RecordUseCase';

type RecordsContextType = {
  addRecordMutation: (record: Record) => void;
  addRecordLoading: boolean;
  addRecordError: Error | null;
  searchLoading: boolean;
  searchTerm: string;
  newRecord?: Record;
  setSearchTerm: (term: string) => void;
  setSearchLoading: (loading: boolean) => void;
};

export const RecordsContext = createContext<RecordsContextType>({
  addRecordMutation: () => {},
  addRecordLoading: false,
  addRecordError: null,
  searchLoading: false,
  searchTerm: '',
  newRecord: undefined,
  setSearchTerm: () => {},
  setSearchLoading: () => {},
});

export const RecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    addRecord: addRecordMutation,
    data: newRecord,
    loading: addRecordLoading,
    error: addRecordError,
  } = useAddRecord();

  return (
    <RecordsContext.Provider
      value={{
        addRecordMutation,
        // @ts-ignore
        newRecord,
        addRecordLoading,
        addRecordError,
        searchTerm,
        setSearchTerm,
        searchLoading,
        setSearchLoading,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
};


export const useRecords = () => {
  return useContext(RecordsContext);
};