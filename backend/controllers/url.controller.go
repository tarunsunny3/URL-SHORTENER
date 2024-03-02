package controllers

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/models"
	"github.com/tarunsunny3/go-url-shortener/myconfig"
	"github.com/tarunsunny3/go-url-shortener/shortener"
	"github.com/tarunsunny3/go-url-shortener/store"
	"gorm.io/gorm"
)

type UrlController struct {
	DB *gorm.DB
}

func NewUrlController(DB *gorm.DB) UrlController {
	return UrlController{DB}
}

// InsertURL inserts a new URL entry into the URLs table
func (uc *UrlController) InsertURL(originalURL, shortURL string, userID uint64, expiryDate time.Time) models.UrlResponse {

	url := models.URL{
		OriginalURL:  originalURL,
		ShortURL:     shortURL,
		UserID:       userID,
		CreationDate: time.Now(),
		ExpiryDate:   expiryDate,
	}

	urlID := uc.DB.Create(&url)

	if err := urlID.Error; err != nil {
		return models.UrlResponse{
			Success:      false,
			ErrorMessage: err.Error(),
		}
	}

	urlResponse := models.UrlResponse{
		Success:  true,
		ShortURL: shortURL,
	}

	return urlResponse
}

// Request model definition
type UrlCreationRequest struct {
	LongUrl string `json:"long_url" binding:"required"`
	UserId  string `json:"user_id"`
}

func isValidURL(input string) bool {
	// Check if the string starts with "http" or "https"
	if !strings.HasPrefix(input, "http://") && !strings.HasPrefix(input, "https://") {
		return false
	}

	// Try parsing the URL
	u, err := url.Parse(input)
	if err != nil {
		return false
	}

	// Check if the scheme is either "http" or "https"
	if u.Scheme != "http" && u.Scheme != "https" {
		return false
	}

	return true
}

func (uc *UrlController) CreateShortUrl(c *gin.Context) {
	var creationRequest UrlCreationRequest
	if err := c.ShouldBindJSON(&creationRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if !isValidURL(creationRequest.LongUrl) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL!!!"})
		return
	}

	shortUrl := shortener.GenerateShortLink(creationRequest.LongUrl, creationRequest.UserId)
	store.SaveUrlMapping(shortUrl, creationRequest.LongUrl, creationRequest.UserId)

	host := myconfig.GetHostURL()
	shortUrlPath := host + "/" + shortUrl

	// Save to SQL table
	expiryDate := time.Now().Add(time.Hour * 24 * 7) // Adjust the expiration time as needed
	userId, _ := strconv.ParseUint(creationRequest.UserId, 10, 32)
	urlResponse := uc.InsertURL(creationRequest.LongUrl, shortUrl, userId, expiryDate)

	if urlResponse.Success {
		c.JSON(200, gin.H{
			"message":   "short url created successfully yess",
			"short_url": shortUrlPath,
		})
	} else {
		log.Fatal(urlResponse.ErrorMessage)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":     "failed to create short URL",
			"message":   urlResponse.ErrorMessage,
			"short_url": shortUrlPath,
		})
	}
}

func (uc *UrlController) HandleShortUrlRedirect(c *gin.Context) {
	shortUrl := c.Param("shortUrl")
	userAgent := c.GetHeader("User-Agent")
	fmt.Print("User-Agent is " + userAgent)
	originalURL, err := store.RetrieveInitialUrl(shortUrl)
	if err == nil {
		// Key not found
		//Check in PostgreSQL URL Table
		urlModel := models.URL{}
		if result := uc.DB.Where("short_url = ?", shortUrl).First(&urlModel); result.Error == nil {
			// Found the URL in PostgreSQL URL Table
			originalURL = urlModel.OriginalURL
			go func() {
				// Create ClickAnalytics record
				clickAnalyticsController := NewClickAnalyticsController(uc.DB)
				if err := clickAnalyticsController.InsertNewAnalytics(urlModel.ID, urlModel.UserID, c.ClientIP(), c.GetHeader("Referer")); err != nil {
					log.Printf("Failed to insert ClickAnalytics: %v", err)
					// Handle error as needed
				}
			}()
		} else {
			// Key not found in PostgreSQL URL Table either
			c.Redirect(302, "/")
			return
			// c.JSON(http.StatusNotFound, gin.H{"error": "Short URL not found"})
			// return
		}
	}
	c.Redirect(302, originalURL)
}
