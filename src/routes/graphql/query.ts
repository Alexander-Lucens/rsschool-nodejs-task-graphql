import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { MemberTypeType, MemberTypeIdEnum } from './types/memberType.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({

	memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: async (_parent, _args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.memberType.findMany();
      },
    },

	memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_parent, args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.memberType.findUnique({
          where: { id: args.id },
        });
      },
    },

	users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.user.findMany();
      },
    },

	user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.user.findUnique({
          where: { id: args.id },
        });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.post.findMany();
      },
    },

	post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.post.findUnique({
          where: { id: args.id },
        });
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.profile.findMany();
      },
    },

	profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args, context: { prisma: FastifyInstance['prisma'] }) => {
        return context.prisma.profile.findUnique({
          where: { id: args.id },
        });
      },
    },
  }),
});