import { Knex } from 'knex';

export const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable('downloads', (table) => {
    table.increments('id').primary();
    table.string('social_reason').notNullable();
    table.string('name').notNullable();
    table.string('surname').notNullable();
    table.string('email').notNullable();
    table.string('file_name').notNullable();
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('downloads');
};