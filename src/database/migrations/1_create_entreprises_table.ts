import { Knex } from 'knex';

export const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable('entreprises', (table) => {
    table.increments('id').primary();
    table.string('social_reason').notNullable();
    table.integer('code_client').notNullable();
    table.string('category').notNullable();
    table.string('subcategory').notNullable();
    table.string('contract').nullable();
    table.string('end_contract').nullable();
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('entreprises');
};

