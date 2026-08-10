import { graphql } from '@apollo/client/react/hoc';
import { GET_APP_MODAL_STATUS } from '@src/graphql/schemes/appModalStatus';

export type GetAppModalStatusResponse = {
  appModalStatus: {
    isAppModalOpen: boolean,
  },
};

export type WithAppModalStatusProps = {
  isAppModalOpen: boolean,
};

export default graphql<{}, GetAppModalStatusResponse, {}, WithAppModalStatusProps>(GET_APP_MODAL_STATUS, {
  props: ({ data }) => ({
    isAppModalOpen: data!.appModalStatus!.isAppModalOpen,
  }),
});
