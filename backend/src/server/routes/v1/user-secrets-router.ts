import { z } from "zod";

import { UserSecretsSchema } from "@app/db/schemas";
import { FOLDERS } from "@app/lib/api-docs";
import { secretsLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerUserSecretsRouter = async (server: FastifyZodProvider) => {
  server.route({
    url: "/",
    method: "POST",
    config: {
      rateLimit: secretsLimit
    },
    schema: {
      description: "Create User Secret",
      security: [
        {
          bearerAuth: []
        }
      ],
      body: z.object({
        key: z.string().trim().describe(FOLDERS.CREATE.workspaceId),
        type: z.string().trim().describe(FOLDERS.CREATE.environment),
        value: z.string().describe(FOLDERS.CREATE.name),
      }),
      response: {
        200: z.object({
          userSecret: UserSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const userSecret = await server.services.userSecrets.createUserSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.body,
      });
      return { userSecret };
    }
  });

  server.route({
    url: "/",
    method: "GET",
    config: {
      rateLimit: secretsLimit
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const data = await server.services.userSecrets.listUserSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.body,
      });
      return data;
    }
  });

  server.route({
    url: "/:id",
    method: "PATCH",
    config: {
      rateLimit: secretsLimit
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const data = await server.services.userSecrets.updateUserSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.params,
        ...req.body,
      });
      return data;
    }
  });

  server.route({
    url: "/:id",
    method: "DELETE",
    config: {
      rateLimit: secretsLimit
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const data = await server.services.userSecrets.deleteUserSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.params,
      });
      return data;
    }
  });

  server.route({
    url: "/:id",
    method: "GET",
    config: {
      rateLimit: secretsLimit
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const data = await server.services.userSecrets.getUserSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.params,
      });
      return data;
    }
  });

};
