package main

import (
	"fmt"
	"log"

	"github.com/tarunsunny3/go-url-shortener/initializers"
	"github.com/tarunsunny3/go-url-shortener/models"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}
	fmt.Printf("OUTSIDE initializers.DB = %v", initializers.DB)

	if initializers.DB == nil {
		// If not, establish the connection
		fmt.Printf("initializers.DB = %v", initializers.DB)
		initializers.ConnectDB(&config)
	}
}

func main() {
	initializers.DB.AutoMigrate(&models.User{})
	initializers.DB.AutoMigrate(&models.URL{})
	initializers.DB.AutoMigrate(&models.ClickAnalytics{})
	fmt.Println("? Migration complete")
}
