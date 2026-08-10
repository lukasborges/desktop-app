import { MutationFunction } from '@apollo/client';

export type MutationData = {
  data: {
    deleteApplication : boolean,
  },
};

type MutationVariables = {
  applicationId: string,
};

export type MutateDeleteApplicationProps = {
  mutateDeleteApplication: MutationFunction<MutationData, MutationVariables>,
};
