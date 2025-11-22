import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { MemberTypeType, MemberTypeIdEnum } from './types/memberType.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { GraphQLLoaders } from './loaders.js';

type Context = {
  prisma: FastifyInstance['prisma'];
  loaders: GraphQLLoaders;
};

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (_parent, args, context: Context) => {
        return context.loaders.memberTypeLoader.load(args.id);
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args, context: Context, info) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const fields = parsedInfo.fieldsByTypeName.User;
        
        const include: any = {};
        if (fields['userSubscribedTo']) {
            include.userSubscribedTo = true;
        }
        if (fields['subscribedToUser']) {
            include.subscribedToUser = true;
        }

        const users = await context.prisma.user.findMany({
            include: Object.keys(include).length > 0 ? include : undefined,
        });

        users.forEach((user) => {
          context.loaders.userLoader.prime(user.id, user);
        });
        
        return users;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args, context: Context) => {
        return context.loaders.userLoader.load(args.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  }),
});