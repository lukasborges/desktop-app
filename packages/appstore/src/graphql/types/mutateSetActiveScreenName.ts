import { MutationFunction } from '@apollo/client';

export type MutationData = {
  data: {
    setActiveScreenName: {
      activeScreenName: string,
    },
  },
};

type MutationVariables = {
  activeScreenName: string,
};

export type MutateSetActiveScreenNameProps = {
  mutateSetActiveScreenName: MutationFunction<MutationData, MutationVariables>,
};
