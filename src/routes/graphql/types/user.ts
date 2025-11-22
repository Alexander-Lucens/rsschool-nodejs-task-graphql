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
      resolve: async (parent, args, { prisma, loaders }: Context) => {
        // Тут сложнее: сначала берем связи из БД, потом грузим юзеров через лоадер
        const subs = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
        });
        // subs - это массив связей, нам нужны authorId
        return loaders.userLoader.loadMany(subs.map((s: any) => s.authorId));
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, { prisma, loaders }: Context) => {
        const subs = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
        });
        return loaders.userLoader.loadMany(subs.map((s: any) => s.subscriberId));
      },
    },
  }),
});