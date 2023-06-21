import { Request, Response } from 'express';
import {connection} from '../database';
import colors, { random } from 'colors';
import axios from 'axios';


  export const getLinkedinPosts = async (req: Request, res: Response) => {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const page = 1; // Page de départ
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
  