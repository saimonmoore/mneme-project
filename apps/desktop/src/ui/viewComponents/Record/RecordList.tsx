import { VStack, useBreakpointValue } from '@mneme/components';

import { RecordCard } from '@mneme/desktop/ui/viewComponents/Record/RecordCard';
import { Record } from '@mneme/desktop/domain/Record/Record';

export const RecordList = ({ records }: { records: Record[] }) => {
  const containerWidth = useBreakpointValue({
    base: '$full',
    sm: '$full',
    md: '$3/4',
    lg: '$2/3',
    xl: '$1/2',
  });

  return (
    <VStack w={containerWidth} space="md" px="$4">
      {records.map((record: Record, index: number) => (
        <RecordCard record={record} key={index} />
      ))}
    </VStack>
  );
};
