import { MutationFunction } from '@apollo/client';

export type MutationData = {
  data: {
    setAppModalStatus: {
      isAppModalOpen: boolean,
    },
  },
};

type MutationVariables = {
  isAppModalOpen: boolean,
};

export type MutateSetAppModalStatusProps = {
  mutateSetAppModalStatus: MutationFunction<MutationData, MutationVariables>,
};
