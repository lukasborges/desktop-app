import { SearchLocalState } from '@src/graphql/initialClientState';
import { GET_SEARCH_STRING } from '@src/graphql/schemes/search';

export interface SetSearchStringVariables {
  searchString: string,
  searchStringAfterEnterPress?: string,
  isEnterPressed?: boolean,
}

export default (_: any, { searchString, searchStringAfterEnterPress, isEnterPressed }: SetSearchStringVariables, { cache }: any) => {
  const newSearchData: SearchLocalState = {
    searchString,
    searchStringAfterEnterPress,
    isEnterPressed,
    __typename: 'SearchString',
  };
  cache.writeQuery({
    query: GET_SEARCH_STRING,
    data: { search: newSearchData },
  });
  return newSearchData;
};
