import { MutationFunction } from '@apollo/client';

export type MutationData = {
  data: {
    setCustomAppRequestMode: {
      appRequestIsOpen: boolean,
      currentMode: string,
    },
  },
};

type MutationVariables = {
  appRequestIsOpen: boolean,
  currentMode: string,
};

export type MutateSetCustomAppRequestModeProps = {
  mutateSetCustomAppRequestMode: MutationFunction<MutationData, MutationVariables>,
};
