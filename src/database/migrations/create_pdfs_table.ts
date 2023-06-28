import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('pdfs', (table) => {
    table.increments('id').primary();
    table.string('ref').notNullable();
    table.string('title').notNullable();
    table.string('category').notNullable();
    table.string('link').notNullable();
    table.timestamps(true, true);
  });

  await knex('pdfs').insert([
    // { ref: 'support', title: 'Préconisations techniques et installation Gestimum ERP', category: 'Général', link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    // { ref: 'support', title: 'Installation Gestimum ERP - Mise à jour de version', category: 'Général', link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    // { ref: 'support', title: "Création d'un champ personnalisé", category: "l'intégré", link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    // { ref: 'support', title: "Création d'un champ person 	Création Champs personnalisés avec formulesnalisé", category: "l'intégré", link: 'http://docs.gestimum.com/ERP/8/Installation/#t=Pages%2FPreambule.htm' },
    

    { ref: 'aide-vente', title: "Gestion Commerciale", category: "Plaquette produits", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-GESTION-COMMERCIALE.pdf' },
    { ref: 'aide-vente', title: "Gestion Comptable", category: "Plaquette produits", link: 'https://www.gestimum.com/wp-content/uploads/2022/07/2022-Fiche-produit-GESTION-COMPTABLE.pdf' },
    { ref: 'aide-vente', title: "Guide des Services", category: "Plaquette produits", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-SERVICES.pdf' },
    { ref: 'aide-vente', title: "Maintenance", category: "Plaquette produits", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-MAINTENANCE.pdf' },
    
    { ref: 'aide-vente', title: "G-Change", category: "Nos modules", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-G-CHANGE.pdf' },
    { ref: 'aide-vente', title: "Les Affaires", category: "Nos modules", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-MODULE-AFFAIRES.pdf' },
    { ref: 'aide-vente', title: "EDI - Vente", category: "Nos modules", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-MODULE-EDI.pdf' },
    { ref: 'aide-vente', title: "Immobilisations", category: "Nos modules", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-produit-MODULE-IMMOS.pdf' },
    { ref: 'aide-vente', title: "Décisionnel", category: "Nos modules", link: 'https://www.gestimum.com/wp-content/uploads/2022/06/2022-Fiche-Produit-DECISIONNEL.pdf' },
    
  ]);
};

export const down = (knex: Knex): Knex.SchemaBuilder => {
  return knex.schema.dropTable('pdfs');
};

