import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberType.js';
import { GraphQLLoaders } from '../loaders.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: (parent, args, { loaders }: { loaders: GraphQLLoaders }) => {
        return loaders.memberTypeLoader.load(parent.memberTypeId);
      },
    },
  }),
});