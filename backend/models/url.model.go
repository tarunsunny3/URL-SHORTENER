package models

import (
	"time"

	"gorm.io/gorm"
)

// URL model
type URL struct {
	gorm.Model
	OriginalURL  string
	ShortURL     string
	UserID       uint64
	CreationDate time.Time
	ExpiryDate   time.Time
	// Add other URL-related fields as needed
}

type UrlResponse struct {
	Success      bool   `json:"success"`
	ErrorMessage string `json:"error_message,omitempty"`
	ShortURL     string `json:"short_url,omitempty"`
	// Add other response-related fields as needed
}
