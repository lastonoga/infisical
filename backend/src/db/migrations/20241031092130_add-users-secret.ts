import { Knex } from "knex";
import { TableName } from "../schemas";
import {
    createOnUpdateTrigger,
    createUpdateAtTriggerFunction,
    dropOnUpdateTrigger,
    dropUpdatedAtTriggerFunction
} from "../utils";

export async function up(knex: Knex): Promise<void> {
    const isTablePresent = await knex.schema.hasTable(TableName.UserSecret);
    if (!isTablePresent) {
        await knex.schema.createTable(TableName.UserSecret, (t) => {
            t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
            //   Secret Fields
            t.string("key", 500).notNullable();
            t.string("type", 500).notNullable();
            t.binary("encryptedValue");
            t.timestamps(true, true, true);
            //   Relation Fields
            t.uuid("userId").index();
            t.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");

            t.uuid("orgId").index();
            t.foreign("orgId").references("id").inTable(TableName.Organization).onDelete("CASCADE");
        });
    }
    // this is a one time function
    await createUpdateAtTriggerFunction(knex);
    await createOnUpdateTrigger(knex, TableName.UserSecret);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TableName.UserSecret);
    await dropOnUpdateTrigger(knex, TableName.UserSecret);
    await dropUpdatedAtTriggerFunction(knex);
}