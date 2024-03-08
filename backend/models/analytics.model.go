package models

import (
	"time"

	"gorm.io/gorm"
)

// ClickAnalytics model
type ClickAnalytics struct {
	gorm.Model
	URLID      uint      `json:"url_id"`
	UserID     uint64    `json:"user_id"`
	Timestamp  time.Time `json:"timestamp"`
	IPAddress  string    `json:"ip_address"`
	Referer    string    `json:"referer"`
	DeviceType string    `json:"device_type"`
}
