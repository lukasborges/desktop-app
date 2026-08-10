import { GET_APP_MODAL_STATUS } from '@src/graphql/schemes/appModalStatus';

export interface SetAppModalStatus {
  isAppModalOpen: boolean,
}

export default (_: any, { isAppModalOpen }: SetAppModalStatus, { cache }: any) => {
  const newAppModalStatus = {
    isAppModalOpen: isAppModalOpen,
    __typename: 'AppModalStatus',
  };
  cache.writeQuery({
    query: GET_APP_MODAL_STATUS,
    data: { appModalStatus: newAppModalStatus },
  });
  return newAppModalStatus;
};
