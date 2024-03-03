// Inside your ClickAnalyticsController or service

package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/models"
	"gorm.io/gorm"
)

type ClickAnalyticsController struct {
	DB *gorm.DB
}

func NewClickAnalyticsController(DB *gorm.DB) ClickAnalyticsController {
	return ClickAnalyticsController{DB}
}

// InsertNewAnalytics creates and inserts a new analytics entry into the database
func (cac *ClickAnalyticsController) InsertNewAnalytics(urlID uint, userID uint64, ipAddress, referer string) error {
	analyticsEntry := models.ClickAnalytics{
		URLID:     urlID,
		UserID:    userID,
		Timestamp: time.Now(),
		IPAddress: ipAddress,
		Referer:   referer,
		// Add other analytics-related fields as needed
	}

	if err := cac.DB.Create(&analyticsEntry).Error; err != nil {
		return err
	}

	return nil
}

// GetAnalyticsForURL fetches analytics data for a specific URL
func (cac *ClickAnalyticsController) FetchAnalyticsForURL(urlID string) (map[string]interface{}, error) {
	// var analyticsData []models.ClickAnalytics

	// 1. Calculate the Number of clicks
	var totalClicks int64
	if err := cac.DB.Model(&models.ClickAnalytics{}).Where("url_id = ?", urlID).Count(&totalClicks).Error; err != nil {
		return nil, err
	}

	// 2. Calculate the Most frequent referer
	var mostFrequentReferer string
	if err := cac.DB.Model(&models.ClickAnalytics{}).
		Where("url_id = ?", urlID).
		Group("referer").
		Order("count(*) DESC").
		Limit(1).
		Pluck("referer", &mostFrequentReferer).
		Error; err != nil {
		return nil, err
	}
	// Prepare the result as a map
	result := map[string]interface{}{
		"totalClicks":         totalClicks,
		"mostFrequentReferer": mostFrequentReferer,
	}

	return result, nil
}

func (uc *ClickAnalyticsController) GetAnalyticsForURL(c *gin.Context) {

	urlId := c.Param("urlid")
	analytics, err := uc.FetchAnalyticsForURL(urlId)

	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
	}

	c.JSON(http.StatusOK, gin.H{"analytics": analytics})

}
