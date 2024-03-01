// Inside your ClickAnalyticsController or service

package controllers

import (
	"time"

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
