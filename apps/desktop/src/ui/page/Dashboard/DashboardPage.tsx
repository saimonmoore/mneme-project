import { MyRecords } from '@mneme/desktop/ui/viewComponents/Record/MyRecords';
import { LoggedInLayout } from '@mneme/desktop/ui/viewComponents/layout/LoggedIn/LoggedInLayout';

export const Dashboard = () => {
  return (
    <LoggedInLayout>
      <MyRecords />
    </LoggedInLayout>
  );
};
