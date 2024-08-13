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

interface EditKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKeyword: string;
  setSelectedKeyword: (keyword: string) => void;
  onSave: () => void;
}

export function EditKeywordModal({
  isOpen,
  onClose,
  selectedKeyword,
  setSelectedKeyword,
  onSave,
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
              value={selectedKeyword}
              onChangeText={setSelectedKeyword}
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
          <Button action="primary" onPress={onSave}>
            <Text>OK</Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}