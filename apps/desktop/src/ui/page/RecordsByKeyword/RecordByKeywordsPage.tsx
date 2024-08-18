import { useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import { useToast, Spinner } from '@mneme/components';
import { LoggedInLayout } from '@mneme/desktop/ui/viewComponents/layout/LoggedIn/LoggedInLayout';
import { MyRecordsByKeyword } from '@mneme/desktop/ui/viewComponents/Record/MyRecordsByKeyword';
import {
  Notification,
  NotificationType,
} from '@mneme/desktop/ui/viewComponents/Notification/Notification';
import { useFindKeywordByLabel } from '@mneme/desktop/usecases/Keyword/KeywordUseCase';
import { Keyword } from '@mneme/desktop/domain/Keyword/Keyword';

type RouteParams = {
  label: string;
};

export const RecordByKeywordsPage = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const label = route.params?.label;

  const toast = useToast();
  const [keyword, setKeyword] = useState<Keyword>();

  // const records = useMnemeStore((state) => state.records);
  // const addRecordToStore = useMnemeStore((state) => state.addRecord);

  const {
    executeQuery: findKeywordByLabel,
    data,
    loading: searchLoading,
    error,
  } = useFindKeywordByLabel(label);

  // Trigger the search when the component mounts
  useEffect(() => {
    findKeywordByLabel();
  }, [label]);

  useEffect(() => {
    if (data) {
      setKeyword(Keyword.create(data));
    }

    if (error) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => (
          <Notification
            id={id}
            type={NotificationType.ERROR}
            title="No records found"
            description={`There was an error looking for your records! (${error.message})`}
          />
        ),
      });

      console.error('Error listing records: ', error);
    }
  }, [data, error]);

  return (
    <LoggedInLayout>
      <Spinner loading={searchLoading}>
        {keyword && <MyRecordsByKeyword keyword={keyword} />}
      </Spinner>
    </LoggedInLayout>
  );
};
