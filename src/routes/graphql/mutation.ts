import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import {
  ChangePostInput,
  ChangeProfileInput,
  ChangeUserInput,
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
} from './types/inputs.js';

type Context = { prisma: FastifyInstance['prisma'] };

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({

	createUser: {
      type: new GraphQLNonNull(UserType),
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_, { dto }, { prisma }: Context) => {
        return prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, { id, dto }, { prisma }: Context) => {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }: Context) => {
        await prisma.user.delete({ where: { id } });
        return '';
      },
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_, { dto }, { prisma }: Context) => {
        return prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, { id, dto }, { prisma }: Context) => {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }: Context) => {
        await prisma.post.delete({ where: { id } });
        return '';
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_, { dto }, { prisma }: Context) => {
        return prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, { id, dto }, { prisma }: Context) => {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }: Context) => {
        await prisma.profile.delete({ where: { id } });
        return '';
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma }: Context) => {
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        return '';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma }: Context) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: { subscriberId: userId, authorId },
          },
        });
        return '';
      },
    },
  }),
});