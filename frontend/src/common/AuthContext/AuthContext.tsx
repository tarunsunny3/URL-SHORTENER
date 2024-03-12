import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AuthService from '../../services/auth.service'
import IUser from '../../types/user.type';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  currentUser: IUser | undefined;
  checkCurrentUser: () => string | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  checkTokenValidity: () => {"active": boolean, "message": string};
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  const checkCurrentUser = () => {
    const {active} = checkTokenValidity();
    if(active){
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        return user;
    }else{
        setCurrentUser(undefined)
        return undefined;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setCurrentUser(undefined);
    } catch (error) {
      console.error('Logout failed:', error);
      setCurrentUser(undefined);
    }
  };
  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      
      setCurrentUser(response.data.user)
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const checkTokenValidity = () => {
    
    const token = AuthService.getToken();

    if (token) {
      try {
        // Decode the token to get the expiration time
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);


        // Check if the token is still valid
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Handle token expiration, e.g., log out the user or refresh the token
          console.log("Token Expired");


          logout();
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
        logout();
        return {"active" :false, "message": "Session Expired, Please Login Again!!"}
      }
    } else {
      // Handle token absence, e.g., log out the user
      logout();
      return {"active" :false, "message": "Session Expired, Please Login Again!!"}
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, checkCurrentUser, logout, login, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
