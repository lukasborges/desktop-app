import { MutationFunction } from '@apollo/client';
import { Application } from '@src/graphql/queries';
import { ApplicationRecipe } from '@src/components/AppStoreContent/AppStoreRequestEdit/AppRequestEdit';

export type MutationData = {
  data: {
    updateApplicationFromRecipe: Application,
  },
};

type MutationVariables = {
  applicationId: string,
  applicationRecipe: ApplicationRecipe,
};

export type MutateUpdateApplicationFromRecipeProps = {
  mutateUpdateApplicationFromRecipe: MutationFunction<MutationData, MutationVariables>,
};
