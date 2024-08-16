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

interface EditKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKeyword: Keyword | undefined;
  setSelectedKeyword: (keyword: Keyword) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export function EditKeywordModal({
  isOpen,
  onClose,
  selectedKeyword,
  setSelectedKeyword,
  onSave,
  isUpdating,
}: EditKeywordModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text>Edit Keyword</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input>
            <InputField
              value={selectedKeyword?.label}
              onChangeText={(text) => setSelectedKeyword(Keyword.create({ hash: selectedKeyword?.hash, label: text }))}
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
          <Button action="primary" onPress={onSave} isDisabled={isUpdating}>
            <Text>{isUpdating ? 'Updating...' : 'Save'}</Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}