import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user-service";
import { useNavigate } from 'react-router-dom';
import styles from './userdashboard.module.css'

interface URL {
  OriginalURL: string;
  ShortURL: string
  // Add other properties as needed
}

const UserDashboard = () => {
  
  const [urls, setUrls] = useState<URL[]>([]);
  const navigate = useNavigate()


  useEffect(() => {
    fetchUserURLs()
  }, [])
  
  const fetchUserURLs = async () => {

      const currUser = AuthService.getCurrentUser();
      if(currUser == null){
        alert("User not logged in")
        navigate("/login")
        return
      }
      try {
        const response = await UserService.fetchAllURLs(currUser.user.ID);
        console.log(response.data.urls);
        
        setUrls(response.data.urls)
      } catch (error) {
        console.error(error);
      }
  }

  const showAnalytics = (url: URL) => {
    navigate('/analytics', { state: { urlData: url } });
  }
  
  return (
    <div style={{width: "100vw"}}>
      <button onClick={fetchUserURLs}>Fetch URLs</button>
      <table className={`${styles.tbl} table table-striped table-hover table-dark`}>
        <thead>
          <tr>
            <th>Original URL</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url, index) => (
            <tr className={styles.longurl} key={index}>
              {
                url.OriginalURL.length < 60 ?
                <td>{url.OriginalURL}</td>
                :
                <td>{`${url.OriginalURL.substring(0, 60)}...`}</td>
              }
              
              <td>{url.ShortURL}</td>
              <td><button onClick={() => showAnalytics(url)}>Show Analytics</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDashboard;
