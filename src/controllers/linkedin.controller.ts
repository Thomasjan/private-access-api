import { Request, Response } from 'express';
import {connection} from '../database';
import colors, { random } from 'colors';
import axios from 'axios';


  export const getLinkedinPosts = async (req: Request, res: Response) => {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const page = 1; // Page de départ
    const count = 100; // Nombre de résultats par page


    const config = {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        // 'X-Restli-Protocol-Version': '2.0.0',
    },
    };

    axios.get(`https://api.linkedin.com/v2/posts?author=urn%3Ali%3Aorganization%3A1201305&q=author&count=${count}`, config)
    .then(response => {
        // Gérer les publications récupérées dans la réponse
        const posts = response.data.elements;
        res.status(200).json(posts)
        console.log(colors.bold.cyan(`getLinkedinPosts !`));
      })
    .catch(error => {
        // Gérer l'erreur
        res.status(500).json(error)
        console.error(error);
    });
  }

  