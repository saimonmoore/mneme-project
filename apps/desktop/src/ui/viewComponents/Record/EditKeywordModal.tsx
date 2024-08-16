import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';
import { KeywordModal } from './KeywordModal';

interface EditKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKeyword: Keyword | undefined;
  setSelectedKeyword: (keyword: Keyword) => void;
  onSave: () => void;
  onDelete: () => void;
  isUpdating: boolean;
}

export function EditKeywordModal({
  isOpen,
  onClose,
  selectedKeyword,
  setSelectedKeyword,
  onSave,
  onDelete,
  isUpdating,
}: EditKeywordModalProps) {
  return (
    <KeywordModal
      isOpen={isOpen}
      onClose={onClose}
      keyword={selectedKeyword}
      setKeyword={setSelectedKeyword}
      onSave={onSave}
      isUpdating={isUpdating}
      title="Edit Keyword"
      saveButtonText="Save"
      onDelete={onDelete}
      canDelete
    />
  );
}