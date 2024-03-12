import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user-service";
import { useNavigate } from 'react-router-dom';
import styles from './userdashboard.module.css'
import Alert from "../../common/Alert/Alert";

interface URL {
  OriginalURL: string;
  ShortURL: string;
}

const UserDashboard = () => {

  const [urls, setUrls] = useState<URL[]>([]);
  const [hostURL, setHostURL] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showFullURL, setShowFullURL] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate()


  useEffect(() => {
    fetchUserURLs()
  }, [])

  const fetchUserURLs = async () => {

    const currUser = AuthService.getCurrentUser();
    if (currUser == null) {
      alert("User not logged in")
      navigate("/login")
      return
    }
    try {
      setIsLoading(true)
      const response = await UserService.fetchAllURLs(currUser.user.ID);
      console.log(response.data.urls);
      setHostURL(response.data.hostURL)
      setUrls(response.data.urls)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(error);
    }
  }
  const copyToClipboard = (shortURL: string) => {
    const shorturl = hostURL + "/" + shortURL;
    navigator.clipboard.writeText(shorturl)
    setMessage("Copied to clipboard successfully!!")
  }
  const showAnalytics = (url: URL) => {
    navigate('/analytics', { state: { urlData: url } });
  }

  return (

    <div>
      {
        message.length > 0 && <Alert message={message} variant="success" />
      }
      {
        isLoading && <h4>Fetching data....</h4>
      }

       {!isLoading && urls.length == 0 && (
        <div>
          <div className='card' style={{ width: "max-content" }}>
            <h3 style={{ textAlign: "center" }}>You have't created any short urls yet, Head over to <a href="/">home</a> to create one now!!</h3>
          </div>
        </div>
      )
      }
      

      {
        urls.length > 0 &&
        <>
          <button className="btn btn-success" onClick={fetchUserURLs}>Fetch URLs</button>
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
                <tr className={styles.longurl} key={index}>
                  {
                    showFullURL ?

                      <td style={{ wordBreak: "break-word" }}>{url.OriginalURL}
                        <span style={{ marginLeft: "2%", cursor: "pointer" }} onClick={() => setShowFullURL(false)}><i className="fa-regular fa-eye-slash"></i></span>
                      </td>
                      :
                      <td>{`${url.OriginalURL.substring(0, 60)}`}<span style={{ marginLeft: "2%", cursor: "pointer" }} onClick={() => setShowFullURL(true)}><i className="fa-solid fa-ellipsis"></i> <i className="fa-regular fa-eye"></i></span></td>
                  }

                  <td>{hostURL + "/" + url.ShortURL}</td>
                  <td><button className="btn btn-primary" onClick={() => showAnalytics(url)}>Show Analytics</button></td>
                  <td><button className="btn btn-info" onClick={() => copyToClipboard(url.ShortURL)}>Copy Short URL</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>

      }

     

    </div>
  );
}

export default UserDashboard;
