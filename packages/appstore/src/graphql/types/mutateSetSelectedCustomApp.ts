import { MutationFunction } from '@apollo/client';
import { Application } from '@src/graphql/queries';

export type MutationData = {
  data: {
    setSelectedCustomApp: {
      app: Application,
    },
  },
};

type MutationVariables = {
  app: Application,
};

export type MutateSetSelectedCustomAppProps = {
  mutateSetSelectedCustomApp: MutationFunction<MutationData, MutationVariables>,
};
