import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  InputField,
  Text,
} from '@mneme/components';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';

interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: Keyword | undefined;
  setKeyword: (keyword: Keyword) => void;
  onSave: () => void;
  isUpdating?: boolean;
  isAdding?: boolean;
  title: string;
  saveButtonText: string;
  inputValue?: string;
  isDisabled?: boolean;
}

export function KeywordModal({
  isOpen,
  onClose,
  keyword,
  setKeyword,
  onSave,
  isUpdating,
  isAdding,
  title,
  saveButtonText,
  inputValue = '',
  isDisabled = false,
}: KeywordModalProps) {

  const primaryAction = isAdding ? 'Adding...' : isUpdating ? 'Updating...' : saveButtonText;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text>{title}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input>
            <InputField
              value={inputValue || keyword?.label}
              onChangeText={(text) => setKeyword(Keyword.create({ hash: keyword?.hash, label: text }))}
              placeholder="Enter keyword"
            />
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            mr="$3"
            onPress={onClose}
          >
            <Text>Cancel</Text>
          </Button>
          <Button action="primary" onPress={onSave} isDisabled={isUpdating || isDisabled}>
            <Text>{primaryAction}</Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}