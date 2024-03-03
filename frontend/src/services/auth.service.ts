import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + "/auth";

class AuthService {
  // Register
  async register(name: string, email: string, password: string) {
    return await axios.post(API_URL + "/register", {
      name,
      email,
      password
    },{
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
      },{
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
}

export default new AuthService();
