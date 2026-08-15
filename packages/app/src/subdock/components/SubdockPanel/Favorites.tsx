import * as React from 'react';
import { MutationFunction } from '@apollo/client/react/types/types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import * as classNames from 'classnames';

import { MinimalSubdockApplication } from '../SubdockItem';
import { ActiveTab } from '../../Container';
import {
  useSelectFavoriteMutation, useCloseFavoriteMutation,
  useUnpinFavoriteMutation, useDetachFavoriteMutation,
  CloseFavoriteMutation, CloseFavoriteMutationVariables,
  SelectFavoriteMutation, SelectFavoriteMutationVariables,
  UnpinFavoriteMutation, UnpinFavoriteMutationVariables,
  DetachFavoriteMutation, DetachFavoriteMutationVariables,
} from '../../queries@local.gql.generated';

import { Favorite, SubdockActionsProps } from './types';
import {
  useScrollToActiveTabOnMount,
  useScrollData,
  IdentifierType,
} from './customHooks';
import { SubdockListStyle, subdockListStyle } from './styles';
import FavoriteItem from './FavoriteItem';

// PROPS

export interface RawFavoriteActions {
  onSelect: MutationFunction<SelectFavoriteMutation, SelectFavoriteMutationVariables>,
  onClose: MutationFunction<CloseFavoriteMutation, CloseFavoriteMutationVariables>,
  onClickFavorite: MutationFunction<UnpinFavoriteMutation, UnpinFavoriteMutationVariables>,
  onClickAttach: SubdockActionsProps['onAttachTab'],
  onClickDetach: MutationFunction<DetachFavoriteMutation, DetachFavoriteMutationVariables>,
}

export type OwnProps = SubdockActionsProps & {
  className?: string,
  application: MinimalSubdockApplication,
  items: Favorite[],
  activeTab: ActiveTab,
};

// COMPONENT

const Favorites = ({
  classes,
  className,
  application,
  items,
  activeTab,
  ...props
}: OwnProps & { classes: SubdockListStyle }) => {
  // Stuff for scrolling
  const internalRef = useScrollToActiveTabOnMount(items, activeTab.url, IdentifierType.Favorite);
  const { onScroll, scrolled } = useScrollData();

  // Vars and other init
  const actions = useFavoritesMutators(props);

  const nbTabs = items.length;
  if (nbTabs === 0) return null;

  return (
    <div className={classes!.container}>
      <div className={classes!.sectionHeader}>
        <p className={classes!.title}>
          Pinned pages
          {nbTabs > 5 && <span> : {nbTabs}</span>}
        </p>
      </div>
      <div
        ref={internalRef}
        onScroll={onScroll}
        className={classNames(
          className,
          classes.content,
          {
            [classes.scrollOverlayTop]: !scrolled.top && nbTabs > 5,
            [classes.scrollOverlayBottom]: !scrolled.bottom && nbTabs > 5,
          }
        )}
      >
        <ul>
          <TransitionGroup>
            {items.map((item, index) =>
              <CSSTransition
                key={item.favoriteId!}
                classNames="all-read-animation"
                timeout={{ enter: 700, exit: 500 }}
              >
                <FavoriteItem
                  actions={actions}
                  application={application}
                  item={item}
                  index={index}
                  isActive={item.url === activeTab.url}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </ul>
      </div>
    </div>
  );
};

// UTILS

/**
 * Get only the necessary actions from props to be used by Favorites.
 */
export const useFavoritesMutators = (props: SubdockActionsProps) => {
  const [onSelect] = useSelectFavoriteMutation();
  const [onClose] = useCloseFavoriteMutation();
  const [onClickFavorite] = useUnpinFavoriteMutation();
  const [onClickDetach] = useDetachFavoriteMutation();

  return {
    onSelect,
    onClose,
    onClickFavorite,
    onClickAttach: props.onAttachTab,
    onClickDetach,
  };
};

// EXPORT

export default injectSheet(subdockListStyle)(Favorites) as React.ComponentType<OwnProps>;
