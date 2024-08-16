import { HStack } from '@gluestack-ui/themed';
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
import { useState } from 'react';

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
  onDelete?: () => void;
  canDelete?: boolean;
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
  onDelete,
  canDelete = false,
}: KeywordModalProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const primaryAction = isAdding
    ? 'Adding...'
    : isUpdating
    ? 'Updating...'
    : saveButtonText;

  const handleDeleteClick = () => {
    if (deleteConfirmation && onDelete) {
      onDelete();
    } else {
      setDeleteConfirmation(true);
    }
  };

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
              onChangeText={(text) =>
                setKeyword(Keyword.create({ hash: keyword?.hash, label: text }))
              }
              placeholder="Enter keyword"
            />
          </Input>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="space-between" width="100%">
            {canDelete && (
              <Button
                action="secondary"
                onPress={handleDeleteClick}
                isDisabled={isUpdating || isDisabled}
              >
                <Text color="$white">
                  {deleteConfirmation ? "Really Delete???" : "Delete!!!"}
                </Text>
              </Button>
            )}
            <HStack>
              <Button
                variant="outline"
                action="secondary"
                mr="$3"
                onPress={onClose}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                action="primary"
                onPress={onSave}
                isDisabled={isUpdating || isDisabled}
              >
                <Text color="$white">{primaryAction}</Text>
              </Button>
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
