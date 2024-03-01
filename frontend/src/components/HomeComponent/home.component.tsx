import axios from "axios";
import React, { useEffect, useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styles from './HomeComponent.module.css'
import AuthService from "../../services/auth.service";
import UrlService from "../../services/url-service"
const Home: React.FC = () => {
  const [shortUrl, setShortUrl] = useState<string>("");
  const [longUrl, setLongUrl] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const fetchUserID = async () => {
    const currentUser = await AuthService.getCurrentUser();
    if(currentUser && currentUser.user){
      setUserId(currentUser.user.ID.toString())
    }
  }
  useEffect(()=>{
    fetchUserID()
  }, [])

  const generateShortURL = async  () => {
    const result = await UrlService.createShortURL(longUrl, userId)
    if(result.status === 200){
      //We get the shorturl in the result
      setShortUrl(result.data.short_url)
    }
  }

  const handleLongURLOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLongUrl(event.target.value)
  }


  return (
    <div className="container">
      {/* <header className="jumbotron"> */}
        <h3 style={{textAlign: "center", fontWeight: "bolder", fontSize: "300%"}}>Your Ultimate destination for shortening URLs</h3>
      {/* </header> */}
      <div className="card card-main">
        <label>Enter your long URL: </label>
        <input value={longUrl} onChange={handleLongURLOnchange} type='text'/>
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
