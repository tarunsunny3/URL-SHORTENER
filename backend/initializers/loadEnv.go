package initializers

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	PostgreSQLConnString string        `mapstructure:"POSTGRES_CONNECTION_STRING"`
	RedisConnAddr        string        `mapstructure:"REDIS_CONNECTION_ADDR"`
	RedisConnPassword    string        `mapstructure:"REDIS_CONNECTION_PASSWORD"`
	ClientOrigin         string        `mapstructure:"CLIENT_ORIGIN"`
	Example              string        `mapstructure:"EXAMPLE"`
	TokenSecret          string        `mapstructure:"TOKEN_SECRET"`
	TokenExpiresIn       time.Duration `mapstructure:"TOKEN_EXPIRED_IN"`
	TokenMaxAge          int           `mapstructure:"TOKEN_MAXAGE"`
}

func LoadConfig(path string) (config Config, err error) {

	// Set default values (these will be overridden if environment variables are present)
	viper.SetDefault("POSTGRES_CONNECTION_STRING", "")
	viper.SetDefault("REDIS_CONNECTION_ADDR", "")
	viper.SetDefault("REDIS_CONNECTION_PASSWORD", "")
	viper.SetDefault("CLIENT_ORIGIN", "")
	viper.SetDefault("TOKEN_SECRET", "")
	viper.SetDefault("TOKEN_EXPIRED_IN", 0)
	viper.SetDefault("TOKEN_MAXAGE", 0)

	viper.AutomaticEnv()

	// Unmarshal configuration into struct
	err = viper.Unmarshal(&config)
	if err != nil {
		fmt.Println("Error unmarshalling config:", err)
	}
	return
}

// func LoadConfig(path string) (config Config, err error) {

// 	viper.AddConfigPath(path)
// 	viper.SetConfigType("env")
// 	viper.SetConfigName("app.env")

// 	viper.AutomaticEnv()
// 	err = viper.ReadInConfig()
// 	if err != nil {
// 		return
// 	}

// 	// Unmarshal configuration into struct
// 	err = viper.Unmarshal(&config)
// 	if err != nil {
// 		fmt.Println("Error unmarshalling config:", err)
// 	}
// 	return
// }
