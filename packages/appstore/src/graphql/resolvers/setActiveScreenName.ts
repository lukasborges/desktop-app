import { GET_ACTIVE_SCREEN_NAME } from '@src/graphql/schemes/activeScreenName';

export interface SetActiveScreenNameVariables {
  activeScreenName: string,
}

export default (_: any, { activeScreenName }: SetActiveScreenNameVariables, { cache }: any) => {
  const newActiveScreenName = { value: activeScreenName, __typename: 'ActiveScreenName' };
  cache.writeQuery({
    query: GET_ACTIVE_SCREEN_NAME,
    data: { activeScreenName: newActiveScreenName },
  });
  return newActiveScreenName;
};
