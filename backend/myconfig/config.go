// config/config.go
package myconfig

import (
	"log"
	"os"
)

// GetPort retrieves the port from the environment variable or uses a default value
func GetPort() string {
	return getEnv("PORT", "8080")
}
func GetHostURL() string {
	// Fetch external URL from environment variable
	externalURL := getEnv("EXTERNAL_URL", "")

	if externalURL == "" {
		return getEnv("BASE_URL", "http://localhost:8080")
	}
	log.Print("GetHostURL() externalURL = " + externalURL)
	return externalURL
}

// getEnv returns the value of the specified environment variable or a default value
func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}
