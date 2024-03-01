import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + "/auth";

class AuthService {
  async login(email: string, password: string) {
    const response = await axios
      .post(API_URL + "/login", {
        email,
        password
      });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  async logout() {
    await axios.get(
      API_URL + "/logout",
      { headers: authHeader() }
    );
    alert("Logout success removed local storage");
    console.log("Logout success removed local storage");
    localStorage.removeItem("user");
  }

  async register(name: string, email: string, password: string) {
    return await axios.post(API_URL + "/register", {
      name,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
