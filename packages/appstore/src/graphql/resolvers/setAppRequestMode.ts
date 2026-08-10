import { GET_CUSTOM_APP_REQUEST_MODE } from '@src/graphql/schemes/customAppRequestMode';

export interface SetCustomAppRequestMode {
  appRequestIsOpen: boolean,
  currentMode: string,
}

export default (_: any, { appRequestIsOpen, currentMode }: SetCustomAppRequestMode, { cache }: any) => {
  const newCustomAppRequestMode = {
    appRequestIsOpen: appRequestIsOpen,
    currentMode: currentMode,
    __typename: 'AppRequestMode',
  };
  cache.writeQuery({
    query: GET_CUSTOM_APP_REQUEST_MODE,
    data: { appRequestMode: newCustomAppRequestMode },
  });
  return newCustomAppRequestMode;
};
