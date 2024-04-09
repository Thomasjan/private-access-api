import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.timestamps(true, true);
  });

  await knex('roles').insert([
    { title: 'Admin' },
    { title: '1.PAR' },
    { title: '2.PME' },
    { title: '3.AUTRES' },
  ]);
};


export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('roles');
};