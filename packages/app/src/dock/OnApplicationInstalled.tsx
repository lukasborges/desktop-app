import { useQuery } from '@apollo/client';
import * as React from 'react';
import { OnApplicationInstalledDocument, OnApplicationInstalledQuery } from './queries@local.gql.generated';

type Props = {
  callback: (applicationId: string) => void,
};

export const OnApplicationInstalled = ({ callback }: Props) => {
  const callbackRef = React.useRef(callback);
  const { data } = useQuery<OnApplicationInstalledQuery>(OnApplicationInstalledDocument);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!data) return;
    callbackRef.current(data.onApplicationInstalled.applicationId);
  }, [data]);

  return null;
};
