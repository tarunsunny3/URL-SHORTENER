package initializers

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB(config *Config) {
	var err error
	connStr := config.PostgreSQLConnString
	// connStr := "postgresql://tarunsunny3:CxPMGIy0nv7D@ep-ancient-bird-a5fu6cfu.us-east-2.aws.neon.tech/my-postgres?sslmode=require"
	for i := 0; i < 10; i++ {
		DB, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
		if err == nil {
			// Connection successful, break out of the loop
			fmt.Println("Connected Successfully to the Database")
			return
		}

		fmt.Printf("Error connecting to the database: %v. Retrying...\n", err)
		time.Sleep(5 * time.Second)
	}

	log.Fatal("Failed to connect to the Database after multiple attempts.")
}
