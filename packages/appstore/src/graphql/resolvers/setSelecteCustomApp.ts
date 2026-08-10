import { Application } from '@src/graphql/queries';
import { GET_SELECTED_CUSTOM_APP } from '@src/graphql/schemes/selectedCustomApp';

export interface SetSelectedCustomApp {
  app: Application,
}

export default (_: any, { app }: SetSelectedCustomApp, { cache }: any) => {
  const newSelectedCustomApp = {
    app: {
      ...app,
      category: {
        ...app.category,
        __typename: 'ApplicationCategory',
      },
      __typename: 'Application',
    },
    __typename: 'SelectedCustomApp',
  };
  cache.writeQuery({
    query: GET_SELECTED_CUSTOM_APP,
    data: { selectedCustomApp: newSelectedCustomApp },
  });
  return newSelectedCustomApp;
};
