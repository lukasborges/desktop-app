import { MutationFunction } from '@apollo/client';

export type MutationData = {
  data: {
    setSearchString: {
      searchString: string,
      searchStringAfterEnterPress?: string,
      isEnterPressed?: boolean,
    },
  },
};

type MutationVariables = {
  searchString: string,
  searchStringAfterEnterPress?: string,
  isEnterPressed?: boolean,
};

export type MutateSetSearchStringProps = {
  mutateSetSearchString: MutationFunction<MutationData, MutationVariables>,
};
