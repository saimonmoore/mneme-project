import { Spinner, VStack, useBreakpointValue } from '@mneme/components';

import { RecordCard } from '@mneme/desktop/ui/viewComponents/Record/RecordCard';
import { Record } from '@mneme/desktop/domain/Record/Record';

export const RecordList = ({
  records,
  loading,
}: {
  records: Record[];
  loading: boolean;
}) => {
  const containerWidth = useBreakpointValue({
    base: '$full',
    sm: '$full',
    md: '$3/4',
    lg: '$2/3',
    xl: '$1/2',
  });

  console.log('[RecordList] records: ', records, (records || []));

  return (
    <VStack w={containerWidth} space="md" px="$4">
      <Spinner loading={loading}>
        {(records || []).map((record: Record, index: number) => (
          <RecordCard record={record} key={index} />
        ))}
      </Spinner>
    </VStack>
  );
};
