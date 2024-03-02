import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

class UrlService {
    async createShortURL(longUrl: string, userId: string) {
        try {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/short-urls",
            {
              long_url: longUrl,
              user_id: userId
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          return response;
        } catch (error) {
          // If an error occurs, Axios will throw an error, and we can handle it here
          throw error;
        }
      }
}

export default new UrlService();
