import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user-service";
import { useNavigate } from 'react-router-dom';
import styles from './userdashboard.module.css';
import Alert from "../../common/Alert/Alert";
import { useAuth } from "../../common/AuthContext/AuthContext";

interface URL {
  OriginalURL: string;
  ShortURL: string;
}

interface TableRowProps {
  url: URL;
  hostURL: string;
  showAnalytics: (url: URL) => void;
  copyToClipboard: (shortURL: string) => void;
}

const TableRow: React.FC<TableRowProps> = ({ url, hostURL, showAnalytics, copyToClipboard }) => {
  const [showFullURL, setShowFullURL] = useState<boolean>(false);

  const toggleShowFullURL = () => {
    setShowFullURL(!showFullURL);
  };

  const truncateURL = (originalURL: string) => {
    return originalURL.length > 60 ? `${originalURL.substring(0, 60)}` : originalURL;
  };

  return (
    <tr className={styles.longurl}>
      <td>
        {showFullURL ? (
          <span style={{ wordBreak: "break-word" }}>{url.OriginalURL}</span>
        ) : (
          truncateURL(url.OriginalURL)
        )}
        <span style={{ cursor: "pointer" }} onClick={toggleShowFullURL}>
          {showFullURL ? <i className="fa-regular fa-eye-slash"></i> :<span> <i className="fa-solid fa-ellipsis"> <i className="fa-regular fa-eye"></i></i></span>}
        </span>
      </td>
      <td>{hostURL + "/" + url.ShortURL}</td>
      <td>
        <button className="btn btn-primary" onClick={() => showAnalytics(url)}>
          Show Analytics
        </button>
      </td>
      <td>
        <button className="btn btn-info" onClick={() => copyToClipboard(url.ShortURL)}>
          Copy Short URL
        </button>
      </td>
    </tr>
  );
};

const UserDashboard = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [hostURL, setHostURL] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {checkCurrentUser, checkTokenValidity} = useAuth();
 
  const navigate = useNavigate();

  const navigateToLoginPage = (message: string) =>{
    
    navigate("/login", { state: { message } });
  }
  useEffect(() => {
    fetchUserURLs();
  }, []);

  const fetchUserURLs = async () => {
    const {active, message }  = checkTokenValidity()
    if(!active){
      navigateToLoginPage(message)
    }
    const currentUser = checkCurrentUser();
    try {
      setIsLoading(true);
      const response = await UserService.fetchAllURLs(currentUser?.ID);
      setHostURL(response.data.hostURL);
      setUrls(response.data.urls);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const copyToClipboard = (shortURL: string) => {
    const shorturl = hostURL + "/" + shortURL;
    navigator.clipboard.writeText(shorturl);
    setMessage("Copied to clipboard successfully!!");
    const timeoutId = setTimeout(() => {
      setMessage("")
    }, 3000);
  };

  const showAnalytics = (url: URL) => {
    navigate('/analytics', { state: { urlData: url } });
  };

  return (
    <div>
      {message.length > 0 && <Alert message={message} variant="success" />}
      {isLoading && <h4>Fetching data....</h4>}

      {urls.length === 0 && !isLoading && (
        <div className='card' style={{ width: "max-content" }}>
          <h3 style={{ textAlign: "center" }}>You haven't created any short URLs yet. Head over to <a href="/">home</a> to create one now!!</h3>
        </div>
      )}

      {urls.length > 0 && (
        <>
          <button className="btn btn-success" onClick={fetchUserURLs}>
            Fetch URLs
          </button>
          <table className={`${styles.tbl} table table-striped table-hover table-bordered table-dark`}>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, index) => (
                <TableRow key={index} url={url} hostURL={hostURL} showAnalytics={showAnalytics} copyToClipboard={copyToClipboard}/>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
