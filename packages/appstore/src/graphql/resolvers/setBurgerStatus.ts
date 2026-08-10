import { IS_BURGER_OPEN } from '@src/graphql/schemes/burgerMenu';

export interface SetBurgerStatusVariables {
  isBurgerOpen: boolean,
}

export default (_: any, { isBurgerOpen }: SetBurgerStatusVariables, { cache }: any) => {
  const newBurgerIsOpen = { value: isBurgerOpen, __typename: 'IsBurgerOpen' };
  cache.writeQuery({
    query: IS_BURGER_OPEN,
    data: { isBurgerOpen: newBurgerIsOpen },
  });
  return newBurgerIsOpen;
};
