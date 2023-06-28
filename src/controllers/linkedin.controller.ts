import { Request, Response } from 'express';
import {connection} from '../database';
import colors, { random } from 'colors';
import axios from 'axios';


  export const getLinkedinPosts = async (req: Request, res: Response) => {

    const accessToken = await getLinkdinToken();
    // console.log(accessToken)

    // const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    
    const count = 100; // Nombre de résultats par page (MAX 100)


    const config = {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        // 'X-Restli-Protocol-Version': '2.0.0',
    },
    };

    // Récupérer les publications de Linkedin
    try {
      const response = await axios.get(`https://api.linkedin.com/v2/posts?author=urn%3Ali%3Aorganization%3A1201305&q=author&count=${count}`, config);
      const posts = response.data.elements;
      console.log(colors.bold.cyan(`getLinkedinPosts!`));
  
      const postsWithImage = await Promise.all(posts.map(async (post: any) => {
        if (post.content?.article?.thumbnail) {
          const thumbnail = post.content.article.thumbnail;
          const imageResponse = await axios.get(`https://api.linkedin.com/v2/images/${thumbnail}`, config);
          const image = imageResponse.data.downloadUrl;
          post.content.article.imageUrl = image;
        }

        if (post.content?.media?.id) {
          const thumbnail = post.content.media.id;

          if(thumbnail.includes("urn:li:video")) {
            const videoResponse = await axios.get(`https://api.linkedin.com/v2/videos/${thumbnail}`, config);
            const video = videoResponse.data.downloadUrl;
            post.content.media.videoUrl = video;
          }
          else if(thumbnail.includes("urn:li:image")) {
            const imageResponse = await axios.get(`https://api.linkedin.com/v2/images/${thumbnail}`, config);
            const image = imageResponse.data.downloadUrl;
            post.content.media.imageUrl = image;
          }
        }

        if(post.content?.multiImage?.images) {
          const images = post.content.multiImage.images;
          images.forEach(async (image: any) => {
            const imageResponse = await axios.get(`https://api.linkedin.com/v2/images/${image.id}`, config);
            const imageUrl = imageResponse.data.downloadUrl;
            image.imageUrl = imageUrl;
          });
        }
        
          
        return post;
      }));
  
      res.status(200).json(postsWithImage);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  }

  //https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:1201305&sharesPerOwner=1000
  

  const getLinkdinToken = async () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM variables WHERE title='LINKEDIN_ACCESS_TOKEN'", (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          reject('Error retrieving LINKEDIN_TOKEN');
          return;
        }
  
        resolve(results[0].value);
      });
    });
  };



  export const refreshLinkedinToken = async (req: Request, res: Response) => {
    const refreshToken = await getRefreshLinkdinToken();

    try{
      const response = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=refresh_token&client_id=78vldbca3nkset&client_secret=cjHAyKajnjBxMypB&refresh_token=${refreshToken}`);
      const accessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      // console.log('accessToken', accessToken)
      // console.log('newRefreshToken', newRefreshToken)

      connection.query(`UPDATE variables SET value='${accessToken}' WHERE title='LINKEDIN_ACCESS_TOKEN'`, (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json(err);
        }
      });

      connection.query(`UPDATE variables SET value='${newRefreshToken}' WHERE title='LINKEDIN_REFRESH_TOKEN'`, (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json(err);
        }
      });

      console.log(colors.bold.cyan(`refreshLinkedinToken!`));
      return res.status(200).json({accessToken, newRefreshToken});
    }
    catch(error) {
      res.status(500).json(error);
      console.error(error);
    }
  }


  const getRefreshLinkdinToken = async () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM variables WHERE title='LINKEDIN_REFRESH_TOKEN'", (err, results: any) => {
        if (err) {
          console.error('Error executing query:', err);
          reject('Error retrieving LINKEDIN_REFRESH_TOKEN');
          return;
        }
  
        resolve(results[0].value);
      });
    });
  };