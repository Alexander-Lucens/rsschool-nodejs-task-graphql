import DataLoader from 'dataloader';
import { FastifyInstance } from 'fastify';
import { User, Post, Profile, MemberType } from '@prisma/client';

export type GraphQLLoaders = {
  userLoader: DataLoader<string, User | null>;
  postLoader: DataLoader<string, Post[]>;
  profileLoader: DataLoader<string, Profile | null>;
  memberTypeLoader: DataLoader<string, MemberType | null>;
  subscribedToUserLoader: DataLoader<string, string[]>;
  userSubscribedToLoader: DataLoader<string, string[]>;
};

export function createLoaders(prisma: FastifyInstance['prisma']): GraphQLLoaders {
  return {
    userLoader: new DataLoader(async (userIds: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds as string[] } },
      });
      const userMap = new Map(users.map((user) => [user.id, user]));
      return userIds.map((id) => userMap.get(id) || null);
    }),

    postLoader: new DataLoader(async (authorIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: authorIds as string[] } },
      });
      const postsMap = new Map<string, Post[]>();
      posts.forEach((post) => {
        if (!postsMap.has(post.authorId)) {
          postsMap.set(post.authorId, []);
        }
        postsMap.get(post.authorId)?.push(post);
      });
      return authorIds.map((id) => postsMap.get(id) || []);
    }),

    profileLoader: new DataLoader(async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: userIds as string[] } },
      });
      const profileMap = new Map(profiles.map((p) => [p.userId, p]));
      return userIds.map((id) => profileMap.get(id) || null);
    }),

    memberTypeLoader: new DataLoader(async (ids: readonly string[]) => {
      const types = await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      });
      const typeMap = new Map(types.map((t) => [t.id, t]));
      return ids.map((id) => typeMap.get(id) || null);
    }),

    userSubscribedToLoader: new DataLoader(async (subscriberIds: readonly string[]) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: subscriberIds as string[] } },
      });
      const map = new Map<string, string[]>();
      subscriptions.forEach((sub) => {
        const list = map.get(sub.subscriberId) || [];
        list.push(sub.authorId);
        map.set(sub.subscriberId, list);
      });
      return subscriberIds.map((id) => map.get(id) || []);
    }),

    subscribedToUserLoader: new DataLoader(async (authorIds: readonly string[]) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: authorIds as string[] } },
      });
      const map = new Map<string, string[]>();
      subscriptions.forEach((sub) => {
        const list = map.get(sub.authorId) || [];
        list.push(sub.subscriberId);
        map.set(sub.authorId, list);
      });
      return authorIds.map((id) => map.get(id) || []);
    }),
  };
}