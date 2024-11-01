import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName, TUserSecrets, TUserSecretsUpdate } from "@app/db/schemas";
import { DatabaseError } from "@app/lib/errors";
import { ormify } from "@app/lib/knex";

export type TUserSecretsDALFactory = ReturnType<typeof userSecretsDALFactory>;

export const userSecretsDALFactory = (db: TDbClient) => {
  const userSecretOrm = ormify(db, TableName.UserSecret);

  const updateSecret = async (
    filter: Partial<TUserSecrets>,
    data: TUserSecretsUpdate,
    tx?: Knex
  ) => {
    try {
      const sec = await (tx || db)(TableName.UserSecret)
        .where(filter)
        .update(data)
        .returning("*");

      return sec[0];
    } catch (error) {
      throw new DatabaseError({ error, name: "update secret" });
    }
  };

  const createSecret = async (
    data: TUserSecretsUpdate,
    tx?: Knex
  ) => {
    try {
      const res = await (tx || db)(TableName.UserSecret)
        .insert({
          key: data.key,
          type: data.type,
          encryptedValue: data.encryptedValue,
          userId: data.userId,
          orgId: data.orgId,
        })
        .returning("*");
      return res[0];
    } catch (error) {
      throw new DatabaseError({ error, name: "update secret" });
    }
  };

  const deleteSecret = async (
    filter: Partial<TUserSecrets>,
    tx?: Knex
  ) => {
    try {
      const res = await (tx || db)(TableName.UserSecret)
        .where(filter)
        .delete()
        .returning("*");
      return res;
    } catch (error) {
      throw new DatabaseError({ error, name: "update secret" });
    }
  };

  const listSecret = async ({
    limit,
    offset = 0,
    ...filter
  }: Partial<TUserSecrets> & { limit: number, offset: number },
    tx?: Knex
  ) => {
    try {
      const res = await (tx || db)(TableName.UserSecret)
        .where(filter)
        .offset(offset)
        .limit(limit)
        .select(
          "id",
          "key",
          "type",
          "createdAt",
          "updatedAt",
          db.raw(`count(*) OVER() as total_count`)
        );
      return { userSecrets: res, totalCount: Number(res?.[0]?.total_count ?? 0) };
    } catch (error) {
      throw new DatabaseError({ error, name: "update secret" });
    }
  };

  const findUserSecretById = async (
    filter: Partial<TUserSecrets>,
    tx?: Knex
  ) => {
    try {
      const res = await (tx || db)(TableName.UserSecret)
        .where(filter)
        .select("*");

      const row = res[0];

      // row.value = JSON.parse(value);

      return row;
    } catch (error) {
      throw new DatabaseError({ error, name: "update secret" });
    }
  };

  return {
    ...userSecretOrm,
    updateSecret,
    createSecret,
    deleteSecret,
    listSecret,
    findUserSecretById,
  };
};
