import axios from "axios";
import authHeader from "./auth-header";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL + "/auth";

class AuthService {
  // Register
  async register(name: string, email: string, password: string) {
    return await axios.post(API_URL + "/register", {
      name,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  // Login
  async login(email: string, password: string) {
    const response = await axios
      .post(API_URL + "/login", {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }
  // Logout
  async logout() {
   
    try {
      const res = await axios.get(API_URL + "/logout", { headers: authHeader() });
      console.log("Logout success removed local storage");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("user");
    }
  }

  isAuthenticated() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.token && user.token.trim() !== "";
    }
    return false;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }

  getToken() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr).token;
    return null;
  }
  
  checkTokenValidity() {
    
    const token = this.getToken();

    if (token) {
      try {
        // Decode the token to get the expiration time
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);


        // Check if the token is still valid
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Handle token expiration, e.g., log out the user or refresh the token
          console.log("Token Expired");


          this.logout();
          return {"active" :false, "message": "Session Expired, Please Login Again!!"}
        } else {
          console.log("Token still Active");
          if (decodedToken.exp) {
            // Convert expiration time to human-readable format
            const expirationDate = new Date(decodedToken.exp * 1000);
            console.log("Token expires at:", expirationDate.toLocaleString());

            // Calculate and print time left in seconds
            const timeLeftInSeconds = decodedToken.exp - currentTime;
            console.log("Time left in seconds:", timeLeftInSeconds);

            // Optionally, convert time left to human-readable format
            const timeLeftDate = new Date(timeLeftInSeconds * 1000);
            console.log("Time left:", timeLeftDate.toISOString().substr(11, 8));
          }
          return {"active" : true, "message": "Success"}

        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle token expiration, e.g., log out the user or refresh the token
        this.logout();
        return {"active" :false, "message": "Session Expired, Please Login Again!!"}
      }
    } else {
      // Handle token absence, e.g., log out the user
      this.logout();
      return {"active" :false, "message": "Session Expired, Please Login Again!!"}
    }
  };
}

export default new AuthService();
