import { MutationFunction } from '@apollo/client';

export type MutationData = {
  data: {
    setBurgerStatus: {
      isBurgerOpen: boolean,
    },
  },
};

type MutationVariables = {
  isBurgerOpen: boolean,
};

export type MutateSetBurgerStatusProps = {
  mutateSetBurgerStatus: MutationFunction<MutationData, MutationVariables>,
};
