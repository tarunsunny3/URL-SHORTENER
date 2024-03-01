import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://34.94.19.218/";

class UrlService {
    async createShortURL(longUrl: string, userId: string) {
      const response = await axios
            .post(API_URL + "short-urls", {
                "long_url": longUrl,
                "user_id": userId
            });
        return response;
    }
  }
  
  export default new UrlService();
  