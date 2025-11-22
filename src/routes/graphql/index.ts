import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, parse, validate, execute } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { RootQueryType } from './query.js';
import { MutationType } from './mutation.js';
import { createLoaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType,
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      try {
        const document = parse(query);
        const validationErrors = validate(schema, document, [depthLimit(5)]);

        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        return await execute({
          schema,
          document,
          variableValues: variables,
          contextValue: {
            prisma,
            loaders: createLoaders(prisma),
          },
        });
      } catch (error) {
        return { errors: [error] };
      }
    },
  });
};

export default plugin;