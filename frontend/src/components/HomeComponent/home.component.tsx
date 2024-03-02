import axios, { Axios, AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styles from './HomeComponent.module.css'
import AuthService from "../../services/auth.service";
import UrlService from "../../services/url-service"
const Home: React.FC = () => {
  const [shortUrl, setShortUrl] = useState<string>("");
  const [longUrl, setLongUrl] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [urlError, setUrlError] = useState<string>("")

  const fetchUserID = async () => {
    const currentUser = await AuthService.getCurrentUser();
    if(currentUser && currentUser.user){
      setUserId(currentUser.user.ID.toString())
    }
  }
  useEffect(()=>{
    fetchUserID()
  }, [])

  interface BackendUrlErrorResponse {
    error: string;
  }
  
  const generateShortURL = async () => {
    try {
      setUrlError("")
      const result = await UrlService.createShortURL(longUrl, userId);
      // If the request is successful (2xx status code)
      if (result.status === 200) {
        setShortUrl(result.data.short_url);
      } else {
        // If the request is unsuccessful (non-2xx status code)
        console.log(result.data.error);
        setUrlError(result.data.error);
        setShortUrl("")
      }
    } catch (error: any) {
      // Handle the error thrown by Axios
      if (axios.isAxiosError(error)) {
        // Axios error with a response (status code is available)
        const axiosError = error as AxiosError<BackendUrlErrorResponse>
        console.log("Error status code: ", error.response?.status);
        console.log("Error response data: ", error.response?.data);
        setShortUrl("")
        setUrlError(axiosError.response?.data?.error || 'An error occurred');
      } else {
        // Other types of errors (network error, etc.)
        console.error("Non-Axios error: ", error);
        setUrlError('An error occurred');
        setShortUrl("")
      }
    }
  };

  const handleLongURLOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUrlError("");
      setLongUrl(event.target.value)
  }


  return (
    <div className="container">
      {/* <header className="jumbotron"> */}
        <h3 style={{textAlign: "center", fontWeight: "bolder", fontSize: "300%"}}>Your Ultimate destination for shortening URLs</h3>
      {/* </header> */}
      <div className="card card-main">
        <label>Enter your long URL: </label>
        <input value={longUrl} onChange={handleLongURLOnchange} type='text'  style={{ borderColor: urlError ? "red" : "" }} required />
        {urlError && <p style={{ color: "red" }}>{urlError}</p>}
        {
          shortUrl.length > 0 &&  <p>Here is your short URL: <span className={styles.shortUrlLabel}>{shortUrl}</span></p>
        }
       
        <div className={styles.hcontainer}>
          <button className="btn-spl" onClick={() => window.open(shortUrl)}>Visit URL</button>
          <button className="btn-spl" onClick={generateShortURL}>Generate Short URL</button>
          <button className="btn-spl">QR Code</button>
          <CopyToClipboard text={shortUrl}>
            <button className="btn-spl">Copy to Clipboard</button>
          </CopyToClipboard>
        </div>
        

      </div>
    </div>
  );
};

export default Home;
