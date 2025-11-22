import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { GraphQLLoaders } from '../loaders.js';

type Context = { prisma: any; loaders: GraphQLLoaders };

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: (parent, args, { loaders }: Context) => {
        return loaders.profileLoader.load(parent.id);
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (parent, args, { loaders }: Context) => {
        return loaders.postLoader.load(parent.id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent: any, args, { loaders }: Context) => {
        if (parent.userSubscribedTo) {
          const authorIds = parent.userSubscribedTo.map((s: any) => s.authorId);
          return loaders.userLoader.loadMany(authorIds);
        }
        const authorIds = await loaders.userSubscribedToLoader.load(parent.id);
        return loaders.userLoader.loadMany(authorIds);
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent: any, args, { loaders }: Context) => {
        if (parent.subscribedToUser) {
          const subscriberIds = parent.subscribedToUser.map((s: any) => s.subscriberId);
          return loaders.userLoader.loadMany(subscriberIds);
        }
        const subscriberIds = await loaders.subscribedToUserLoader.load(parent.id);
        return loaders.userLoader.loadMany(subscriberIds);
      },
    },
  }),
});