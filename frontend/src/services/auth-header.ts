import { AxiosRequestHeaders } from "axios";

export default function authHeader(): AxiosRequestHeaders {
  const userStr = localStorage.getItem("user");
  let user = null;
  
  if (userStr) {
    user = JSON.parse(userStr);
  }

  if (user && user.token) {
    return {
      'Authorization': 'Bearer ' + user.token,
      'Content-Type': 'application/json',
    }; 
  } else {
    return {
      'Content-Type': 'application/json',
    };
  }
}