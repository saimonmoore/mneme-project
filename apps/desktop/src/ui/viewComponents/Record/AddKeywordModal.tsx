import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';
import { KeywordModal } from './KeywordModal';
import { useState } from 'react';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  setNewKeyword: (keyword: Keyword) => void;
  onSave: () => void;
  isAdding: boolean;
}

export function AddKeywordModal({
  isOpen,
  onClose,
  setNewKeyword,
  onSave,
  isAdding,
}: AddKeywordModalProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSetKeyword = (keyword: Keyword) => {
    setNewKeyword(keyword);
    setInputValue(keyword.label);
  };

  return (
    <KeywordModal
      isOpen={isOpen}
      onClose={onClose}
      keyword={undefined}
      setKeyword={handleSetKeyword}
      onSave={() => {onSave(); setInputValue(''); }}
      isUpdating={isAdding}
      isAdding={isAdding}
      title="Add Keyword"
      saveButtonText="Add"
      inputValue={inputValue}
      isDisabled={inputValue.length < 2}
    />
  );
}