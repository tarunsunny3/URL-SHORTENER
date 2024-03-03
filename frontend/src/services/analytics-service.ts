import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + "/analytics";

// interface UrlData {
//     ID: number;
//     OriginalURL: string;
//     ShortURL: string;
//   }

class UrlAnalyticsService {
    async fetchUrlAnalytics(urlId: string) {
        try {

        console.log("URL ID is ", urlId);
            
          const response = await axios.get(
            `${API_URL}/urls/${urlId}`,
            {
              headers: authHeader()
            }
          );
          return response;
        } catch (error) {
          // If an error occurs, Axios will throw an error, and we can handle it here
          throw error;
        }
      }
}
export default new UrlAnalyticsService();