import { Knex } from 'knex';

export const up = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.createTable('uploads', (table) => {
    table.increments('id').primary();
    table.string('version').notNullable();
    table.string('file_name').notNullable();
    table.string('file_path').notNullable();
    table.string('type').notNullable();
    table.string('image_path').notNullable();
    table.string('description').notNullable();
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('uploads');
};