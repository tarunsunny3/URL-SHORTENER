import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + "/user";

class UserService {
    async fetchAllURLs(userId: string) {
        try {
          const response = await axios.get(
            `${API_URL}/urls/${userId}`,
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
export default new UserService();