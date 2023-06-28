import { Knex } from 'knex';

export const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable('variables', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('value').notNullable();
    
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('variables');
};

