import { addResolveFunctionsToSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import appResolvers from '../app/resolvers';
import autoUpdateResolvers from '../auto-update/resolvers';
import applicationsResolvers from '../applications/resolvers';
import abstractApplicationsResolvers from '../abstract-application/resolvers';
import activityResolvers from '../activity/resolvers';
import tabWebContentResolvers from '../tab-webcontents/resolvers';
import tabsResolvers from '../tabs/resolvers';
import resourcesResolvers from '../resources/worker/resolvers';
import favoriteResolver from '../favorites/resolvers';
import onboardingResolver from '../onboarding/resolvers';

// Classic `addResolveFunctionsToSchema` does not support reactive resolvers
// (resolvers that returns Observable) whereas it's definitely fine.
// Let's override its declaration to make make typing happy
/**
 * Import and add Platform resolvers to the schema.
 */
export function addAllResolvers(schema: GraphQLSchema) {
  const addResolvers = addResolveFunctionsToSchema as any;
  addResolvers({ schema, resolvers: appResolvers });
  addResolvers({ schema, resolvers: autoUpdateResolvers });
  addResolvers({ schema, resolvers: applicationsResolvers });
  addResolvers({ schema, resolvers: abstractApplicationsResolvers });
  addResolvers({ schema, resolvers: activityResolvers });
  addResolvers({ schema, resolvers: tabWebContentResolvers });
  addResolvers({ schema, resolvers: tabsResolvers });
  addResolvers({ schema, resolvers: resourcesResolvers });
  addResolvers({ schema, resolvers: favoriteResolver });
  addResolvers({ schema, resolvers: onboardingResolver });
}
