import axios from 'axios';
require('dotenv').config();

const interval =  6 * 60 * 60 * 1000; // 6 hours

setInterval(() => {
    console.log('Synchronizing data...');
    synchro();
}, interval);

const synchro = async () => {
    try {
        const response = await getGestimumClients();
        const type_contrats = ['PARTENAIRE', 'EXPERT', 'EXPERT SUPPORT', 'G-WEB Infra', 'G-WEB', 'G-MAIL', 'G-MAJ'];
        const clients = response.filter((client: any) => type_contrats.includes(client.Contrat));
        const entreprises = await getEntreprises();
        
        console.log(`Gestimum clients: ${clients.length}, Entreprises: ${entreprises.length}`);
        
        // create new clients
        for (const client of clients) {
            await createClients(client, entreprises);
        }
        
        // update existing clients if necessary
        for (const entreprise of entreprises) {
            await updateEntreprise(entreprise, clients);
        }
        
        console.log('Data synchronization completed.');
    } catch (error) {
        console.log('Error during data synchronization:', error);
    }
};




const getGestimumClients = async () => {
    try {
        const response = await axios.get(`${process.env.ERP_API_URL}/clients/getGestimumClients/`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.TOKEN_SECRET,
              },
        });
    
        const clients = response.data.clients;
        return clients;
    } catch (error) {
        console.log(error);
    }
}

const getEntreprises = async () => {
    try {
        const response = await axios.get(`${process.env.SERVER_URL}/api/entreprises/getEntreprises`);
    
        const entreprises = response.data;
        return entreprises;
    } catch (error) {
        console.log(error);
    }
}

const formatDate = (date: string) => {
    return date?.split('T')[0];
    
}


const createClients = async (client: any, entreprises: any) => {
    const entreprise = entreprises.find(entreprise => entreprise.code_client === client.PCF_CODE);
        if (!entreprise) {
            const newEntreprise = {
                social_reason: client.PCF_RS,
                code_client: client.PCF_CODE,
                category: client.FAT_CODE,
                subcategory: client.SFT_CODE,
                contract: client.Contrat,
                end_contract: formatDate(client.FIN_CONTRAT),
            }
            try {
                console.log('Creating'.green, newEntreprise.social_reason);
                await axios.post(`${process.env.SERVER_URL}/api/entreprises/addEntreprise`, newEntreprise, {
                    headers: {
                        'Content-Type': 'application/json',
                      }
                });
                console.log('New entreprise added');
                return newEntreprise;
            } catch (error: any) {
                console.log("Error creating new entreprise".red, error?.response?.data);
            }
        }
}


const updateEntreprise = async (entreprise: any, clients: any) => {
    const client = clients.find(client => client.PCF_CODE === entreprise.code_client);
    if (client) {
        if (client.FAT_CODE != entreprise.category || client.SFT_CODE != entreprise.subcategory || client.Contrat != entreprise.contract || formatDate(client.FIN_CONTRAT) != entreprise.end_contract) {
            const updatedEntreprise = {
                social_reason: client.PCF_RS,
                code_client: client.PCF_CODE,
                category: client.FAT_CODE,
                subcategory: client.SFT_CODE,
                contract: client.Contrat,
                end_contract: formatDate(client.FIN_CONTRAT),
            }
            try {
                console.log('Updating'.yellow, updatedEntreprise.social_reason);
                await axios.put(`${process.env.SERVER_URL}/api/entreprises/updateEntreprise/${entreprise.id}`, updatedEntreprise, {
                    headers: {
                        'Content-Type': 'application/json',
                      }
                });
                console.log('Entreprise updated');
                return updatedEntreprise;
            } catch (error: any) {
                console.log("Error updating entreprise".red, error?.response?.data);
            }
        }
    }
}